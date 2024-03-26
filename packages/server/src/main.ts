import { createHTTPHandler } from "@trpc/server/adapters/standalone";
import { Lazy } from "backts-utils";
import { IncomingMessage, ServerResponse, createServer } from "http";
import { createProxyServer } from "http-proxy";
import { BackTsServer } from ".";
import { AppContext, createAppContext } from "./context";
import { createAuthHandler } from "./handlers/auth";
import { handlePublic } from "./handlers/public";
import { handleStaticApp } from "./handlers/static";
import { RequestContext } from "./requestcontext";
import { handleNotFound, handleUnauthorized } from "./handlers/exceptions";

const devProxy = new Lazy(async () =>
  createProxyServer({ target: "http://localhost:5173", ws: true })
);

export function backTsHandler<AppContextType extends AppContext>(
  config: BackTsServer<AppContextType>
) {
  const { authHandler, handleLoginPage } = createAuthHandler(config);

  const appContext = config.appContext(
    createAppContext(config, handleLoginPage)
  );

  const router = config.createRouter(appContext);
  const trpcHandler = createHTTPHandler({
    router,
    onError({ error }) {
      console.error(error);
    },
  });
  const handler = async (
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage>
  ) => {
    try {
      const reqctx = new RequestContext(req, res, appContext);
      await reqctx.initUser();
      await reqctx.initOidcToken();

      switch (reqctx.pathParts[0]) {
        case "auth":
          return authHandler(reqctx);
        case "trpc":
          // TODO: auth
          if (reqctx.user) {
            req.url = reqctx.path.replace(/^\/trpc/, "");
            return trpcHandler(req, res);
          } else {
            return handleUnauthorized(reqctx);
          }
        case "public":
          return await handlePublic(reqctx);
        case "api":
          if (config.apiHandler) {
            return await config.apiHandler(reqctx);
          } else {
            return handleNotFound(reqctx);
          }
        default:
          if (reqctx.user) {
            if (process.env.NODE_ENV === "development") {
              (await devProxy.get()).web(req, res);
            } else {
              return await handleStaticApp(reqctx);
            }
          } else {
            return await handleLoginPage(reqctx);
          }
      }
    } catch (e) {
      console.error(e);
      res.statusCode = 500;
      res.end();
    }
  };
  return handler;
}

export function createBackTsServer<AppContextType extends AppContext>(
  config: BackTsServer<AppContextType>
) {
  const handler = backTsHandler(config);
  const server = createServer(handler);

  server.on("upgrade", (req, socket, head) => {
    if (process.env.NODE_ENV === "development") {
      (async () => {
        (await devProxy.get()).ws(req, socket, head);
      })();
    } else {
      socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
    }
  });
  return server;
}
