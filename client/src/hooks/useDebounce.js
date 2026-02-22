import { useState, useEffect } from "react";

export function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebounced(value);
    }, delay);
    return () => clearTimeout(timeoutId);
  }, [value, delay]);

  return debounced;
}
