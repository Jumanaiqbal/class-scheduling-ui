import { useState, useEffect, useCallback, useRef } from 'react';

export const useApi = (apiFunction, immediate = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Use ref to store the latest apiFunction without causing effect triggers
  const apiFunctionRef = useRef(apiFunction);
  apiFunctionRef.current = apiFunction;

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunctionRef.current(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies needed as we use ref

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return { data, loading, error, execute, setData };
};