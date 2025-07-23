import { useState } from 'react';

interface AddToWatchlistParams {
  accountId: string;
  sessionId: string;
  movieId: string;
  addToWatchlist?: boolean;
}

export const useWatchlist = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const addToWatchlist = async ({ accountId, sessionId, movieId, addToWatchlist = true }: AddToWatchlistParams) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/tmdb/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountId,
          sessionId,
          movieId,
          addToWatchlist,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to update watchlist');
        setSuccess(false);
        return;
      }
      setSuccess(true);
    } catch (err) {
      setError((err as Error).message);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return { addToWatchlist, loading, error, success };
};
