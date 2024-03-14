import { User } from "backts/src/model/User";
import { CollectionReference } from "@google-cloud/firestore";
import { DataBase } from "../database";

export class UserModel {
  constructor(public db: DataBase) {
    this.col = this.db.fsCol<User>("users");
  }
  col: CollectionReference<User>;
}
