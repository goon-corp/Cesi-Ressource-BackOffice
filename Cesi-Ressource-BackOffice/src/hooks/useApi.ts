import { useState, useEffect, useCallback, useRef } from 'react';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends ApiState<T> {
  refetch: () => void;
}

export function useApi<T>(fetcher: () => Promise<T>): UseApiReturn<T> {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const execute = useCallback(() => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    fetcherRef.current()
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((err: unknown) =>
        setState({
          data: null,
          loading: false,
          error: err instanceof Error ? err.message : 'Une erreur est survenue',
        })
      );
  }, []);

  useEffect(() => {
    execute();
  }, [execute]);

  return { ...state, refetch: execute };
}
