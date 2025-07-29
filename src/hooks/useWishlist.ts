import { useState } from 'react';

interface AddToWishlistParams {
  accountId: string;
  sessionId: string;
  movieId: string;
  addToWishlist?: boolean;
}

export const useWishlist = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const addToWishlist = async ({ accountId, sessionId, movieId, addToWishlist = true }: AddToWishlistParams) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/tmdb/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountId,
          sessionId,
          movieId,
          addToWishlist,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to update wishlist');
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

  const isMovieInWishlist = async ({movieId}: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/tmdb/account_states/${movieId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to update wishlist');
        setSuccess(false);
        return data;
      }
      setSuccess(true);
    } catch (err) {
      setError((err as Error).message);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }

  return { isMovieInWishlist, addToWishlist, loading, error, success };
};
