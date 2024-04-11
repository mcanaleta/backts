import {
  CollectionReference,
  DocumentReference,
  DocumentSnapshot,
  Query,
  collection,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { useGlobalContext } from "@client/contexts/global.context";

export function useFirestoreQuery<T>(
  col: string,
  props?: {
    dateField?: string;
    fn?: (q: Query<T>) => Query<T>;
    ready?: boolean;
    key: string;
  }
) {
  const [docs, setDocs] = useState<DocumentSnapshot<T>[]>();
  const [data, setData] = useState<T[]>();
  const [loading, setLoading] = useState(true);
  // const appSession = useAppSession();
  const firebase = useGlobalContext();

  const finalQuery = useMemo(() => {
    const c = collection(firebase.firestore, col) as CollectionReference<T>;
    return props?.fn ? props.fn(c) : c;
    //props.fn is usually a lambda, so it would be a new object every time
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [col, firebase.firestore, props?.dateField, props?.key, props?.ready]);

  useEffect(() => {
    if (props?.ready !== false) {
      const unsubscribe = onSnapshot(finalQuery, (snapshot) => {
        console.log("snapshot", snapshot.docs.length);
        const data: T[] = [];
        setDocs(snapshot.docs);
        snapshot.forEach((doc) => {
          data.push(doc.data() as T);
        });
        setData(data);
        setLoading(false);
      });

      return () => {
        unsubscribe();
      };
    } else {
      setDocs([]);
      setData([]);
      setLoading(false);
    }
  }, [finalQuery, props?.ready, props?.key]);

  return { docs, data, loading };
}

export function useFirestoreDoc<T>({
  path,
  enabled,
}: {
  path: string;
  enabled?: boolean;
}) {
  const [snapshot, setSnapshot] = useState<DocumentSnapshot<T>>();
  const [loading, setLoading] = useState(enabled);
  const [data, setData] = useState<T>();
  const firebase = useGlobalContext();

  useEffect(() => {
    if (enabled === false) {
      return;
    }
    const unsubscribe = onSnapshot(
      doc(firebase.firestore, path) as DocumentReference<T>,
      (s) => {
        setSnapshot(s);
        setData(s.data());
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [path, firebase.firestore, enabled]);

  return { snapshot, loading, data };
}
