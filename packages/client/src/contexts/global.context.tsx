/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from "react";
// firebaseConfig.js
import { ParsedToken, User, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { FirebaseInit } from "@client/utils/firebase.utils";

// Initialize Firebase

export const GlobalContext = createContext<GlobalContextType>(
  null as unknown as GlobalContextType
);

export function useGlobalContext() {
  return useContext(GlobalContext);
}

function useGlobalContextInit({ fbApp, fbFirestore, fbAuth }: FirebaseInit) {
  const [user, setUser] = useState<User | null>();
  const [claims, setClaims] = useState<ParsedToken | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastError, setLastError] = useState<any | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(fbAuth, (newUser) => {
      if (newUser) {
        setUser(newUser);
        newUser.getIdTokenResult().then((idTokenResult) => {
          const claims: any = idTokenResult.claims;
          setClaims(claims);
        });
      } else if (user === undefined) {
        setUser(null);
      }
    });
    return () => {
      unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function logout() {
    await fbAuth.signOut();
    await fetch("/auth/logout", {
      method: "POST",
    });
    window.location.href = "/";
  }

  async function runAsync(fn: () => Promise<any>) {
    try {
      setLoading(true);
      console.log("runAsync");
      setLastError(null);
      await fn();
    } catch (error: any) {
      setLastError(error);
    } finally {
      setLoading(false);
    }
  }

  return {
    fbApp,
    firestore: fbFirestore,
    user,
    logout,
    claims,
    runAsync,
    loading,
    lastError,
  };
}

export type GlobalContextType = ReturnType<typeof useGlobalContextInit>;

export function GlobalContextProvider({
  firebaseInit,
  children,
}: {
  firebaseInit: FirebaseInit;
  children: React.ReactNode;
}) {
  const ctx = useGlobalContextInit(firebaseInit);
  return ctx.user ? (
    <GlobalContext.Provider value={ctx}>{children}</GlobalContext.Provider>
  ) : ctx.user === null ? (
    <div>
      Failed to login to firebase <a href="/auth/login">login again</a>
    </div>
  ) : (
    <div>Loading...</div>
  );
}
