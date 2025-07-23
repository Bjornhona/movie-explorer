import { useState, useCallback, useEffect } from 'react';
import { Movie } from '../types.ts';

interface MoviesResponse {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
}

export const useWishlistMovies = (accountId: string | null, sessionId: string | null, reloadKey: number = 0) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMovies = useCallback(async (pageToFetch = 1) => {
    if (!accountId || !sessionId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/tmdb/wishlist?accountId=${accountId}&sessionId=${sessionId}&page=${pageToFetch}`);
      if (!response.ok) throw new Error('Failed to fetch wishlist movies');
      const data: MoviesResponse = await response.json();
      setMovies(prev => {
        if (pageToFetch === 1) return data.results;
        const existingIds = new Set(prev.map(m => m.id));
        const newUnique = data.results.filter(m => !existingIds.has(m.id));
        return [...prev, ...newUnique];
      });
      setPage(data.page);
      setTotalPages(data.total_pages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [accountId, sessionId]);

  useEffect(() => {
    setMovies([]);
    setPage(1);
    setTotalPages(null);
    fetchMovies(1);
  }, [fetchMovies, reloadKey]);

  const loadMore = () => {
    if (totalPages && page < totalPages && !loading) {
      fetchMovies(page + 1);
    }
  };

  return { movies, loading, error, loadMore, hasMore: totalPages ? page < totalPages : true };
}; 