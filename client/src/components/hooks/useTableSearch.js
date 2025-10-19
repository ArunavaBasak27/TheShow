import { useCallback, useEffect, useRef, useState } from "react";

export const useTableSearch = (initialPage = 1, debounceDelay = 500) => {
  const [page, setPage] = useState(initialPage);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const timerRef = useRef(null);
  const prevDebouncedRef = useRef(debouncedSearch); // NEW: Track previous for transitions

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      if (searchTerm !== "") {
        setPage(1);
      }
      timerRef.current = null;
    }, debounceDelay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [searchTerm, debounceDelay]);

  // NEW: Reset page on transition to empty search (catches races)
  useEffect(() => {
    if (prevDebouncedRef.current !== "" && debouncedSearch === "") {
      setPage(1);
    }
    prevDebouncedRef.current = debouncedSearch;
  }, [debouncedSearch]);

  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleClearSearch = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setSearchTerm("");
    setDebouncedSearch("");
    setPage(1);
  }, []);

  const resetPage = useCallback((newPage = 1) => {
    setPage(newPage);
  }, []);

  return {
    page,
    searchTerm,
    debouncedSearch,
    handleSearch,
    handleClearSearch,
    resetPage,
    setPage,
  };
};
