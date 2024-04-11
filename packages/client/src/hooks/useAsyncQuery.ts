import { useEffect, useState } from "react";

export function useAsyncQuery<T>(loader: () => Promise<T>, deps: any[] = []) {
  const [state, setState] = useState<{
    loading: boolean;
    error: any;
    data: T | null;
  }>({
    loading: true,
    error: null,
    data: null,
  });

  async function refresh() {
    setState({
      loading: true,
      error: null,
      data: null,
    });
    try {
      const data = await loader();
      setState({
        loading: false,
        error: null,
        data,
      });
    } catch (error) {
      setState({
        loading: false,
        error,
        data: null,
      });
    }
  }

  useEffect(() => {
    refresh();
  }, deps);

  return { ...state, refresh };
}
