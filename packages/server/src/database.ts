import { CollectionReference, Firestore } from "@google-cloud/firestore";

export class DataBase {
  constructor(public firestore: Firestore) {}

  fsCol<T>(name: string) {
    return this.firestore.collection(name) as CollectionReference<T>;
  }
}
