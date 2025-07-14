import { useState } from 'react';

interface MovieDetails {
  // Add relevant movie detail fields as needed
  id: number;
  title: string;
  overview: string;
  [key: string]: any;
}

export const useMovieById = () => {
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getMovieById = async (id: string, language: string = 'en-US') => {
    setLoading(true);
    setError(null);
    setMovie(null);
    try {
      const response = await fetch(`/api/tmdb/movie/${id}?language=${language}`);
      if (!response.ok) {
        throw new Error('Failed to fetch movie details');
      }
      const data = await response.json();
      setMovie(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setMovie(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { movie, loading, error, getMovieById };
}; 