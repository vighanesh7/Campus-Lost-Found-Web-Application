import { useEffect, useState } from 'react';
import api from '../services/api';
let cache = null; // categories rarely change, so share one fetch across pages
export default function useCategories() {
  const [categories, setCategories] = useState(cache || []);
  const [loading, setLoading] = useState(!cache);
  useEffect(() => {
    if (cache) return undefined;
    let alive = true;
    api.get('/categories').then((r) => { cache = r.data.data.categories; if (alive) setCategories(cache); })
      .catch(() => {}).finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, []);
  return { categories, loading };
}
export const clearCategoryCache = () => { cache = null; };
