import { Lazy } from "backts-utils";
import { readFile } from "fs/promises";
import { FirebaseConfig } from "..";
import { httpReadJsonBody } from "../lib/nodehttp";
import { handleUnauthorized } from "./exceptions";
import { RequestContext } from "../requestcontext";
// import { fbAuth } from "./fb";
export function createAuthHandler(config: FirebaseConfig) {
  async function authHandler(reqctx: RequestContext) {
    if (reqctx.pathParts[1] == "login" && reqctx.isPost) {
      return await handleLogin(reqctx);
    } else if (reqctx.pathParts[1] == "logout" && reqctx.isPost) {
      return await handleLogout(reqctx);
    }
    return await handleLoginPage(reqctx);
  }

  async function handleLogin(reqctx: RequestContext) {
    const body = await httpReadJsonBody(reqctx.req);
    const res = reqctx.res;
    if (body.idtoken) {
      const user = await reqctx.appContext.fbAuth.verifyIdToken(body.idtoken);
      if (!user.email || !user.email_verified) {
        return handleUnauthorized(reqctx);
      }
      const dbUser = await reqctx.appContext.models.usersModel.col
        .doc(user.email)
        .get()
        .then((doc) => doc.data());
      if (!dbUser) {
        return handleUnauthorized(reqctx);
      }
      const role = dbUser.role;
      if (!role) {
        return handleUnauthorized(reqctx);
      }
      await reqctx.appContext.fbAuth.setCustomUserClaims(user.uid, { role });
      console.log(`setting cookie idtoken`);
      res.setHeader(
        "Set-Cookie",
        `fbidt=${body.idtoken}; HttpOnly; Max-Age=3600; SameSite=Strict; Path=/`
      );
    }
    res.write("thanks");
    res.end();
  }

  const loginContents = new Lazy(async () => {
    const loginTemplate = await readFile("./serverassets/login.html", "utf8");
    const loginContents = loginTemplate.replace(
      "// SERVER_FIREBASE_CONFIG_PLACEHOLDER",
      `const firebaseConfig = ${JSON.stringify(config)}`
    );
    return loginContents;
  });

  async function handleLoginPage(reqctx: RequestContext) {
    const { res } = reqctx;
    res.setHeader("Content-Type", "text/html");
    res.write(await loginContents.get());
    res.end();
  }

  async function handleLogout(reqctx: RequestContext) {
    const { res } = reqctx;
    res.setHeader(
      "Set-Cookie",
      `fbidt=; HttpOnly; Max-Age=0; SameSite=Strict; Path=/`
    );
    res.writeHead(302, { Location: "/" });
    res.end();
  }

  return { authHandler, handleLogin, handleLoginPage, handleLogout };
}
