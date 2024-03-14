import { createServer } from "http";
import process from "node:process";
import { createAuthHandler } from "./handlers/auth";
import { handleStaticApp } from "./handlers/static";
import { handlePublic } from "./handlers/public";
import { createHTTPHandler } from "@trpc/server/adapters/standalone";
import { AnyRouter } from "@trpc/server";
import { initTRPC } from "@trpc/server";
import { AppContext, createAppContext } from "./context";
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
  measurementId: string;
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
  createApi: (
    trpcContext: TRPCContext,
    appContext: AppContextType
  ) => AnyRouter;

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
};

export * from "./main";

export * from "./database";
export * from "./requestcontext";
export * from "./context";
