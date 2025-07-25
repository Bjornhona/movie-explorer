import { useState, useEffect } from "react";
import { useAuthentication } from "../hooks/useAuthentication.ts";
import { getBackgroundColor } from "../functions.ts";
import StarIcon from "./icons/StarIcon.tsx";
import HeartIcon from "./icons/HeartIcon.tsx";
import BookmarkIcon from "./icons/BookmarkIcon.tsx";
import { useMovieById } from "../hooks/useMovieById.ts";
import { useWishlist } from "../hooks/useWishlist.ts";
import { useWishlistMovies } from "../hooks/useWishlistMovies.ts";
import Toast from "./Toast.tsx";

interface MovieDetailsPageProps {
  movieId: string;
  category: string;
}

const MovieDetailsPage = ({ movieId, category }: MovieDetailsPageProps) => {
  const {
    movieById,
    loading: movieLoading,
    error: movieError,
  } = useMovieById(movieId);

  console.log(movieById);

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
  const { movies: wishlistMovies } = useWishlistMovies(
    accountId,
    sessionId,
    wishlistReloadKey
  );
  const [showWishlistToast, setShowWishlistToast] = useState(false);
  const [showAuthToast, setShowAuthToast] = useState(false);

  useEffect(() => {
    if (wishlistSuccess) {
      setShowWishlistToast(true);
      const timeout = setTimeout(() => setShowWishlistToast(false), 2500);
      return () => clearTimeout(timeout);
    }
  }, [wishlistSuccess]);

  useEffect(() => {
    if (wishlistError) {
      setShowWishlistToast(true);
      const timeout = setTimeout(() => setShowWishlistToast(false), 2500);
      return () => clearTimeout(timeout);
    }
  }, [wishlistError]);

  useEffect(() => {
    if (authError) {
      setShowAuthToast(true);
      const timeout = setTimeout(() => setShowAuthToast(false), 2500);
      return () => clearTimeout(timeout);
    }
  }, [authError]);

  // Check if this movie is in the wishlist
  const isInWishlist = wishlistMovies.some(
    (m) => String(m.id) === String(movieId)
  );

  const handleLogin = async () => {
    const requestToken = await getRequestToken();
    if (requestToken) {
      const redirectUrl =
        window.location.origin +
        window.location.pathname +
        window.location.search;
      redirectToTmdbApproval(requestToken, redirectUrl);
    }
  };

  const handleWishlistToggle = async () => {
    if (!accountId || !sessionId) return;
    await addToWishlist({
      accountId,
      sessionId,
      movieId,
      addToWishlist: !isInWishlist,
    });
    setWishlistReloadKey((k) => k + 1);
  };

  const getWishlistIcon = () => {
    switch (category) {
      case "upcoming":
        return <HeartIcon color={isInWishlist ? "red" : "gray"} />;
      case "popular":
        return <StarIcon color={isInWishlist ? "gold" : "gray"} />;
      default:
        return <BookmarkIcon color={isInWishlist ? "teal" : "gray"} />;
    }
  };

  if (movieLoading) return <div>Loading movie details...</div>;
  if (movieError)
    return <div style={{ color: "red" }}>Error: {movieError}</div>;
  if (!movieById) return <div>Movie not found.</div>;

  const imageUrl = `https://image.tmdb.org/t/p/w500${movieById.backdrop_path}`;

  const fontMap: Record<string, string> = {
    upcoming: 'Raleway, sans-serif',
    popular: 'Poppins, sans-serif',
    top_rated: 'Playfair Display, serif'
  };
  const fontFamily = fontMap[category] || 'Poppins, sans-serif';

  return (
    <div
      data-testid={"movie-details"}
      style={{ backgroundColor: getBackgroundColor(category) }}
    >
      <h1 style={{ fontFamily }}>{movieById.title}</h1>
      <p>{movieById.tagline}</p>
      <div>
        <img src={imageUrl} alt={movieById.title} style={{ width: "150px" }} />
      </div>
      <p>{category}</p>
      <p>{movieById.overview}</p>
      <button
        aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        onClick={!sessionId || !accountId ? handleLogin : handleWishlistToggle}
        disabled={authLoading || wishlistLoading}
      >
        {getWishlistIcon()}
      </button>
      {showWishlistToast &&
        (wishlistSuccess ? (
          <Toast
            message={
              isInWishlist
                ? "Movie added to wishlist!"
                : "Movie removed from wishlist!"
            }
            color="green"
            onClose={() => setShowWishlistToast(false)}
          />
        ) : wishlistError ? (
          <Toast
            message={`Failed to update wishlist: ${wishlistError}`}
            color="red"
            onClose={() => setShowWishlistToast(false)}
          />
        ) : null)}
      {showAuthToast && authError && (
        <Toast
          message={`Auth error: ${authError}`}
          color="red"
          onClose={() => setShowAuthToast(false)}
        />
      )}
      <div aria-label={'info-area'}>
        <a href={movieById.homepage}>Go to homepage</a>
        <p>Release date: {movieById.release_date}</p>
      </div>
    </div>
  );
};

export default MovieDetailsPage;
