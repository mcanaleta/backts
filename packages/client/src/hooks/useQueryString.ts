import { useEffect, useState } from "react";

export function useQueryString(
  key: string,
  initialValue: string
): [string, (value: string) => void] {
  // Get the current query string value
  const [value, setValue] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get(key) || initialValue;
  });

  // Update URL when state changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (value === initialValue) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    window.history.pushState({}, "", `${window.location.pathname}?${params}`);
  }, [key, value, initialValue]);

  return [value, setValue];
}
