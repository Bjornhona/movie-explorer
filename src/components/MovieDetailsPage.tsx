import { useState } from "react";
import { useAuthentication } from "../hooks/useAuthentication.ts";
import { getBackgroundColor } from "../functions.ts";
import StarIcon from "./icons/StarIcon.tsx";
import HeartIcon from "./icons/HeartIcon.tsx";
import BookmarkIcon from "./icons/BookmarkIcon.tsx";
import { useMovieById } from "../hooks/useMovieById.ts";
import { useWishlist } from "../hooks/useWishlist.ts";
import { useWishlistMovies } from "../hooks/useWishlistMovies.ts";

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
    addToWishlist,
    loading: wishlistLoading,
    error: wishlistError,
    success: wishlistSuccess,
  } = useWishlist();
  const [wishlistReloadKey, setWishlistReloadKey] = useState(0);
  const { movies: wishlistMovies } = useWishlistMovies(accountId, sessionId, wishlistReloadKey);

  // Check if this movie is in the wishlist
  const isInWishlist = wishlistMovies.some(m => String(m.id) === String(movieId));

  const handleLogin = async () => {
    const requestToken = await getRequestToken();
    if (requestToken) {
      const redirectUrl = window.location.origin + window.location.pathname + window.location.search;
      redirectToTmdbApproval(requestToken, redirectUrl);
    }
  };

  const handleWishlistToggle = async () => {
    if (!accountId || !sessionId) return;
    await addToWishlist({ accountId, sessionId, movieId, addToWishlist: !isInWishlist });
    setWishlistReloadKey(k => k + 1);
  };

  const getWishlistIcon = () => {
    const color = isInWishlist
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
        aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        onClick={!sessionId || !accountId ? handleLogin : handleWishlistToggle}
        disabled={authLoading || wishlistLoading}
      >
        {getWishlistIcon()}
      </button>
      {wishlistSuccess && (
        <div style={{ color: 'green' }}>
          {isInWishlist ? "Movie added to wishlist!" : "Movie removed from wishlist!"}
        </div>
      )}
      {wishlistError && <div style={{ color: 'red' }}>Failed to update wishlist: {wishlistError}</div>}
      {authError && <div style={{ color: 'red' }}>Auth error: {authError}</div>}
    </div>
  );
};

export default MovieDetailsPage;
