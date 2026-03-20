/**
 * useDebounce — delays updating the returned value until the input value
 * has been stable for `delay` milliseconds.
 *
 * Used in HomePage to avoid firing an API search request on every keystroke.
 */
import { useState, useEffect } from 'react';

export default function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
