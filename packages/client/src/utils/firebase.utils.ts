/* eslint-disable react-refresh/only-export-components */
// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";

export function initFirebase(props: {
  projectId: string;
  firebaseConfig: {
    apiKey: string;
    appId: string;
    measurementId?: string;
  };
}) {
  const firebaseConfig = {
    apiKey: props.firebaseConfig.apiKey,
    authDomain: `${props.projectId}.firebaseapp.com`,
    projectId: props.projectId,
    storageBucket: `${props.projectId}.appspot.com`,
    // messagingSenderId: props.firebaseConfig.messagingSenderId,
    appId: props.firebaseConfig.appId,
    measurementId: props.firebaseConfig.measurementId,
  };
  const fbApp = initializeApp(firebaseConfig);
  const fbFirestore = initializeFirestore(fbApp, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
    }),
  });
  const fbAuth = getAuth(fbApp);
  return { fbApp, fbFirestore, fbAuth };
}

export type FirebaseInit = ReturnType<typeof initFirebase>;
