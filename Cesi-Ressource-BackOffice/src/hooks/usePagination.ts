import { useState } from 'react';

interface UsePaginationReturn {
  pageNumber: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  reset: () => void;
}

export function usePagination(initialPageSize = 10): UsePaginationReturn {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSizeState] = useState(initialPageSize);

  const setPage = (page: number) => setPageNumber(page);

  const setPageSize = (size: number) => {
    setPageSizeState(size);
    setPageNumber(1);
  };

  const reset = () => {
    setPageNumber(1);
    setPageSizeState(initialPageSize);
  };

  return { pageNumber, pageSize, setPage, setPageSize, reset };
}
