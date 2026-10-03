import { useEffect, useState } from 'react';
// Returns `value` only after it stopped changing for `delay` ms (avoids an API call per keystroke).
export default function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => { const t = setTimeout(() => setDebounced(value), delay); return () => clearTimeout(t); }, [value, delay]);
  return debounced;
}
