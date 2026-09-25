import { useCallback, useEffect, useState } from "react";

export function usePaginatedList(getPage) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);

  const reload = useCallback(() => {
    setReloadKey((current) => current + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadPage = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getPage(page + 1, rowsPerPage);
        const nextData = response.data || [];
        const nextMeta = response.meta || {
          page: 1,
          limit: rowsPerPage,
          total: 0,
          total_pages: 0,
        };

        if (cancelled) return;

        setTotal(nextMeta.total);

        if (nextMeta.total_pages > 0 && page >= nextMeta.total_pages) {
          setPage(nextMeta.total_pages - 1);
          return;
        }

        setItems(nextData);
      } catch (requestError) {
        if (!cancelled) {
          setError(requestError.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadPage();

    return () => {
      cancelled = true;
    };
  }, [getPage, page, rowsPerPage, reloadKey]);

  const handlePageChange = useCallback((nextPage) => {
    setPage(nextPage);
  }, []);

  const handleRowsPerPageChange = useCallback((nextRowsPerPage) => {
    setRowsPerPage(nextRowsPerPage);
    setPage(0);
  }, []);

  return {
    items,
    loading,
    error,
    page,
    rowsPerPage,
    total,
    onPageChange: handlePageChange,
    onRowsPerPageChange: handleRowsPerPageChange,
    reload,
  };
}