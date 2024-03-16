import { DecodedIdToken } from "firebase-admin/auth";
import { OAuth2Client, TokenPayload } from "google-auth-library";
import { IncomingMessage, ServerResponse } from "http";
import { AppContext } from "./context";
import { httpReadCookies } from "./lib/nodehttp";
import { tryOrNull } from "./lib/trycatch";

const oauth2Client = new OAuth2Client();

export class RequestContext {
  host: string;
  url: URL;
  path: string;
  pathParts: string[];

  isPost: boolean;
  isGet: boolean;

  user?: DecodedIdToken;
  oidcToken?: TokenPayload;

  constructor(
    public req: IncomingMessage,
    public res: ServerResponse<IncomingMessage>,
    public appContext: AppContext
  ) {
    this.host = req.headers.host || "localhost";
    this.url = new URL("http://" + this.host + req.url);
    this.path = this.url.pathname;
    this.pathParts = this.path.split("/").filter(Boolean);
    this.isGet = req.method == "GET";
    this.isPost = !this.isGet && req.method == "POST";
  }

  async initUser() {
    const cookies = await httpReadCookies(this.req);
    const fbidt = cookies["fbidt"];
    // console.log("fbidt", fbidt);
    const user = fbidt
      ? await tryOrNull(() => this.appContext.fbAuth.verifyIdToken(fbidt))
      : null;
    if (!user || !user.email || !user.email_verified) {
      return null;
    }
    if (user.email != "marc@cloudnumbers.net") {
      return null;
    }
    this.user = user;
  }

  getBearerToken() {
    const auth = this.req.headers["authorization"];
    if (!auth) {
      return null;
    }
    const parts = auth.split(" ");
    if (parts.length != 2) {
      return null;
    }
    if (parts[0] != "Bearer") {
      return null;
    }
    return parts[1];
  }

  async initOidcToken() {
    const token = this.getBearerToken();
    if (!token) {
      return false;
    }
    const ticket = await oauth2Client.verifyIdToken({
      idToken: token,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return false;
    }

    this.oidcToken = payload;
  }
}
