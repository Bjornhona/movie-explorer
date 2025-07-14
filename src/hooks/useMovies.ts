import { useState, useCallback, useEffect } from 'react';
import { Movie } from '../types.ts';

interface MoviesResponse {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
}

export const useMovies = (category: string = 'upcoming') => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMovies = useCallback(async (pageToFetch = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/tmdb/movie/list?category=${category}&page=${pageToFetch}`);
      if (!response.ok) throw new Error('Failed to fetch movies');
      const data: MoviesResponse = await response.json();
      setMovies(prev => {
        if (pageToFetch === 1) return data.results;
        const existingIds = new Set(prev.map(m => m.id));
        const newUnique = data.results.filter(m => !existingIds.has(m.id));
        return [...prev, ...newUnique];
      });
      setPage(pageToFetch);
      setTotalPages(data.total_pages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [category]);

  // Initial load
  useEffect(() => {
    setMovies([]); // Reset movies when category changes
    setPage(1);
    setTotalPages(null);
    fetchMovies(1);
  }, [fetchMovies]);

  const loadMore = () => {
    const nextPage = page + 1;
    if (totalPages && nextPage <= totalPages && !loading) {
      fetchMovies(nextPage);
    }
  };

  return { movies, loading, error, loadMore, hasMore: totalPages ? page < totalPages : true };
}; 