import { useState, useEffect } from 'react';
import { Movie } from '../types.ts';

export const useMovieById = (movieId: string) => {
  const [movieById, setMovieById] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getMovieById = async (id: string, language: string = 'en-US') => {
    setLoading(true);
    setError(null);
    setMovieById(null);
    try {
      const response = await fetch(`/api/tmdb/movie/${id}?language=${language}`);
      if (!response.ok) {
        throw new Error('Failed to fetch movie details');
      }
      const data = await response.json();
      setMovieById(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setMovieById(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMovieById(movieId);
  }, [movieId]);

  return { movieById, loading, error, getMovieById };
}; 