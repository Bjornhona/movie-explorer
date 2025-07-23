import { useState } from "react";
import { useAuthentication } from "../hooks/useAuthentication.ts";
import { getBackgroundColor } from "../functions.ts";
import StarIcon from "./icons/StarIcon.tsx";
import HeartIcon from "./icons/HeartIcon.tsx";
import BookmarkIcon from "./icons/BookmarkIcon.tsx";
import { useMovieById } from "../hooks/useMovieById.ts";
import { useWatchlist } from "../hooks/useWatchlist.ts";
import { useWatchlistMovies } from "../hooks/useWatchlistMovies.ts";

interface MovieDetailsPageProps {
  movieId: string;
  category: string;
}

const MovieDetailsPage = ({ movieId, category }: MovieDetailsPageProps) => {
  const { movieById } = useMovieById(movieId);
  const {
    sessionId,
    accountId,
    loading: authLoading,
    error: authError,
    getRequestToken,
    redirectToTmdbApproval,
  } = useAuthentication();
  const {
    addToWatchlist,
    loading: watchlistLoading,
    error: watchlistError,
    success: watchlistSuccess,
  } = useWatchlist();
  const [watchlistReloadKey, setWatchlistReloadKey] = useState(0);
  const { movies: watchlistMovies } = useWatchlistMovies(accountId, sessionId, watchlistReloadKey);

  // Check if this movie is in the watchlist
  const isInWatchlist = watchlistMovies.some(m => String(m.id) === String(movieId));

  const handleLogin = async () => {
    const requestToken = await getRequestToken();
    if (requestToken) {
      const redirectUrl = window.location.origin + window.location.pathname + window.location.search;
      redirectToTmdbApproval(requestToken, redirectUrl);
    }
  };

  const handleAddToWatchlist = async () => {
    if (!accountId || !sessionId) return;
    await addToWatchlist({ accountId, sessionId, movieId, addToWatchlist: true });
    setWatchlistReloadKey(k => k + 1);
  };

  const getWishlistIcon = () => {
    const color = isInWatchlist
      ? category === "upcoming"
        ? "red"
        : category === "popular"
        ? "gold"
        : "teal"
      : "grey";
    switch (category) {
      case "upcoming":
        return <HeartIcon color={color} />;
      case "popular":
        return <StarIcon color={color} />;
      default:
        return <BookmarkIcon color={color} />;
    }
  };

  return (
    <div
      data-testid={"movie-details"}
      style={{ backgroundColor: getBackgroundColor(category) }}
    >
      <h1>{movieById?.title}</h1>
      <p>{category}</p>
      <button
        aria-label="Add to wishlist"
        onClick={!sessionId || !accountId ? handleLogin : handleAddToWatchlist}
        disabled={authLoading || watchlistLoading}
      >
        {getWishlistIcon()}
      </button>
      {watchlistSuccess && <div style={{ color: 'green' }}>Movie added to watchlist!</div>}
      {watchlistError && <div style={{ color: 'red' }}>Failed to add to watchlist: {watchlistError}</div>}
      {authError && <div style={{ color: 'red' }}>Auth error: {authError}</div>}
    </div>
  );
};

export default MovieDetailsPage;
