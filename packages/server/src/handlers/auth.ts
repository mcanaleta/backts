import { Lazy } from "backts-utils";
import { BackTsServer, FirebaseConfig } from "..";
import { httpReadJsonBody } from "../lib/nodehttp";
import { handleUnauthorized } from "./exceptions";
import { RequestContext } from "../requestcontext";
import loginTemplate from "../assets/login.html?raw";

// import { fbAuth } from "./fb";
export function createAuthHandler(config: BackTsServer<any>) {
  async function authHandler(reqctx: RequestContext) {
    if (reqctx.pathParts[1] == "login" && reqctx.isPost) {
      return await handleLogin(reqctx);
    } else if (reqctx.pathParts[1] == "logout" && reqctx.isPost) {
      return await handleLogout(reqctx);
    }
    return await handleLoginPage(reqctx);
  }

  async function handleLogin(reqctx: RequestContext) {
    async function getRoleFromDb(email: string) {
      const dbUser = await reqctx.appContext.models.usersModel.col
        .doc(email)
        .get()
        .then((doc) => doc.data());
      if (!dbUser) {
        return null;
      }
      const role = dbUser.role;
      if (!role) {
        return null;
      }
      return role;
    }

    const body = await httpReadJsonBody(reqctx.req);
    const res = reqctx.res;
    if (body.idtoken) {
      const user = await reqctx.appContext.fbAuth.verifyIdToken(body.idtoken);
      if (!user.email || !user.email_verified) {
        return handleUnauthorized(reqctx);
      }
      const role = config.authVerifier
        ? await config.authVerifier(user)
        : await getRoleFromDb(user.email);

      console.log(`role: ${role}`);
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
    console.log(`thisFileDir: ${__dirname}`);
    const loginContents = loginTemplate
      .replace(
        "// SERVER_FIREBASE_CONFIG_PLACEHOLDER",
        `const firebaseConfig = ${JSON.stringify(config.firebase)}`
      )
      .replace("TITLE_PLACEHOLDER", config.title);

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
