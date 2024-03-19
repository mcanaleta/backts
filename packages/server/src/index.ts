import { AnyRouter, initTRPC } from "@trpc/server";
import { AppContext } from "./context";
import { RequestContext } from "./requestcontext";

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

export type TRPCContext = ReturnType<typeof initTRPC.create>;
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
  auth: (reqctx: RequestContext) => Promise<void>;

  /**
   * Creates the API router.
   * @param trpcContext - The TRPC context.
   * @returns The API router.
   */
  createRouter: (appContext: AppContextType) => AnyRouter;

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

  title: string;
  adminEmail: string;
};

export * from "./main";

export * from "./context";
export * from "./database";
export * from "./requestcontext";
