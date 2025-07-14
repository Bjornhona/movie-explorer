import { useState, useCallback, useEffect } from 'react';

interface Movie {
  id: number;
}

interface MoviesResponse {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
}

export const useMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log('movies: ', movies);
  console.log('page: ', page);
  console.log('totalPages: ', totalPages);
  console.log('loading: ', loading);

  const fetchNowPlayingMovies = useCallback(async (pageToFetch = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/tmdb/movie/now_playing?page=${pageToFetch}`);
      if (!response.ok) throw new Error('Failed to fetch movies');
      const data: MoviesResponse = await response.json();
      setMovies(prev => pageToFetch === 1 ? data.results : [...prev, ...data.results]);
      // setMovies(prev => {
      //   if (pageToFetch === 1) return data.results;
      //   const existingIds = new Set(prev.map(m => m.id));
      //   const newUnique = data.results.filter(m => !existingIds.has(m.id));
      //   return [...prev, ...newUnique];
      // });
      // setPage(data.page);
      setPage(pageToFetch);
      setTotalPages(data.total_pages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchNowPlayingMovies(1);
  }, [fetchNowPlayingMovies]);

  // const loadMore = () => {
  //   if (totalPages && page < totalPages && !loading) {
  //     fetchMovies(page + 1);
  //   }
  // };
  const loadMore = () => {
    const nextPage = page + 1;
    if (totalPages && nextPage <= totalPages && !loading) {
      fetchNowPlayingMovies(nextPage);
    }
  };

  return { movies, loading, error, loadMore, hasMore: totalPages ? page < totalPages : true };
}; 