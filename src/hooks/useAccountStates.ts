import { useState } from "react";

interface CheckWishlistParams {
  movieId: string;
  sessionId: string;
}

export const useAccountStates = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const isMovieInWishlist = async ({
    movieId,
    sessionId,
  }: CheckWishlistParams): Promise<boolean> => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!sessionId) {
      return false;
    }

    try {
      const res = await fetch(
        `/api/tmdb/account_states?movieId=${movieId}&session_id=${sessionId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.ok) {
        console.error("Failed to check wishlist status");
        return false;
      }

      const data = await res.json();
      return data.watchlist || false;
    } catch (err) {
      console.error("Error checking wishlist status:", err);
      setError((err as Error).message);
      setSuccess(false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { isMovieInWishlist, loading, error, success };
};
