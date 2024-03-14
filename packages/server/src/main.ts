import { IncomingMessage, ServerResponse } from "http";
import { createAuthHandler } from "./handlers/auth";
import { handleStaticApp } from "./handlers/static";
import { handlePublic } from "./handlers/public";
import { createHTTPHandler } from "@trpc/server/adapters/standalone";
import { AnyRouter } from "@trpc/server";
import { initTRPC } from "@trpc/server";
import { AppContext, createAppContext } from "./context";
import { BackTsServer } from ".";
import { RequestContext } from "./requestcontext";

export function backTsHandler<AppContextType extends AppContext>(
  config: BackTsServer<AppContextType>
) {
  const { authHandler, handleLoginPage } = createAuthHandler(config.firebase);

  const appContext = config.appContext(
    createAppContext(config, handleLoginPage)
  );

  const trpcContext = initTRPC.create();
  const router = config.createApi(trpcContext, appContext);
  const trpcHandler = createHTTPHandler({
    router,
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
          req.url = reqctx.path.replace(/^\/trpc/, "");
          return trpcHandler(req, res);
        case "public":
          return await handlePublic(reqctx);
        default:
          return await handleStaticApp(reqctx);
      }
    } catch (e) {
      console.log("erriririri");
      console.error(e);
      console.log("erriririri");
      res.statusCode = 500;
      res.end();
    }
  };
  return handler;
}
