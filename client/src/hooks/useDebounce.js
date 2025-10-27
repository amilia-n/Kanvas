import { useEffect, useState } from "react";

/**
 * Debounce a changing value.
 * @param {*} value  Incoming value
 * @param {number} delay  ms (default 500)
 * @returns {*} debounced value
 */

export function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return debounced;
}

export default useDebounce;