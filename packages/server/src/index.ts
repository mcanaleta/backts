import { AppContext } from "./context";
import { RequestContext } from "./requestcontext";
import { DecodedIdToken } from "firebase-admin/auth";

/*
/auth: login, logout, ...
/api
/api/frontend
/public: any public file, like favicon.ico, ...
/*: the frontend app
*/

/*
Params:
- auth middleware
- apis
- public files
- frontend app
- firebase details
*/

export type FirebaseConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
};
/**
 * Represents the BackTsServer configuration.
 * @template AppContextType - The type of the application context.
 */
export type BackTsServer<AppContextType extends AppContext> = {
  /**
   * Authenticates the request context.
   * @param reqctx - The request context.
   * @returns A promise that resolves when the authentication is complete.
   */
  auth: (reqctx: RequestContext<AppContextType>) => Promise<void>;

  /**
   * The Firebase configuration.
   */
  firebase: FirebaseConfig;

  /**
   * Creates the application context.
   * @param base - The base application context.
   * @returns The typed application context.
   */
  appContext: (base: AppContext) => AppContextType;
  apiHandler?: (reqctx: RequestContext<AppContextType>) => Promise<void>;
  authVerifier?: (token: DecodedIdToken) => Promise<string | null>;

  title: string;
};

export * from "./main";

export * from "./context";
export * from "./database";
export * from "./requestcontext";
export * from "./handlers/exceptions";
export * from "./lib/nodehttp";
export * from "./lib/rpc";
