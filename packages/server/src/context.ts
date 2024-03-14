import { Firestore } from "@google-cloud/firestore";
import { applicationDefault, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { DataBase } from "./database";
import { UserModel } from "./domain/User";
import { BackTsServer } from ".";

export function createAppContext(
  config: BackTsServer<any>,
  handleLoginPage: (reqctx: any) => Promise<void>
) {
  const firestore = new Firestore({
    projectId: config.firebase.projectId,
  });

  const database = new DataBase(firestore);

  const usersModel = new UserModel(database);

  const models = {
    usersModel,
  };

  //console.log(process.env.GOOGLE_APPLICATION_CREDENTIALS);

  const fbApp = initializeApp({
    projectId: config.firebase.projectId,
    credential: applicationDefault(),
  });

  const fbAuth = getAuth(fbApp);

  return {
    config,
    firestore,
    database,
    models,
    fbApp,
    fbAuth,
    handleLoginPage,
  };
}

export type AppContext = ReturnType<typeof createAppContext>;
