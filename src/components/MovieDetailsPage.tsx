import { useState, useEffect, useMemo } from "react";
import { useAuthentication } from "../hooks/useAuthentication.ts";
import { useMovieById } from "../hooks/useMovieById.ts";
import { useWishlist } from "../hooks/useWishlist.ts";
import { useWishlistMovies } from "../hooks/useWishlistMovies.ts";
import Toast from "./Toast.tsx";
import { CATEGORIES } from "../constants.ts";
import { Category } from "../types.ts";

interface MovieDetailsPageProps {
  movieId: string;
  categoryId: string;
}

const MovieDetailsPage = ({ movieId, categoryId }: MovieDetailsPageProps) => {
  const {
    movieById,
    loading: movieLoading,
    error: movieError,
  } = useMovieById(movieId);

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

  const currentCategory = useMemo(() => {
    return (
      CATEGORIES.find((c: Category) => c.id === categoryId) || CATEGORIES[0]
    );
  }, [categoryId]);

  // Memoize wishlistIdSet to check if movie is in wishlist
  const wishlistIdSet = useMemo(
    () => new Set(wishlistMovies.map((m) => m.id)),
    [wishlistMovies]
  );
  const isInWishlist = wishlistIdSet.has(Number(movieId));

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

  if (movieLoading) return <div>Loading movie details...</div>;
  if (movieError)
    return <div style={{ color: "red" }}>Error: {movieError}</div>;
  if (!movieById) return <div>Movie not found.</div>;

  const imageUrl = `https://image.tmdb.org/t/p/w500${movieById.backdrop_path}`;

  const backgroundColor = currentCategory.bgColor;
  const fontFamily = currentCategory.fontFamily;
  const iconColor = currentCategory.iconColor;
  const Icon = currentCategory.icon;

  return (
    <div
      data-testid={"movie-details"}
      style={{ backgroundColor: backgroundColor }}
    >
      <div className={"header"}>
        <h1 style={{ fontFamily }}>{movieById.title}</h1>
        <p>{movieById.tagline}</p>
      </div>
      <div className={"content"}>
        <div className={"image"}>
          <img
            src={imageUrl}
            alt={movieById.title}
            style={{ width: "150px" }}
            loading="lazy"
          />
        </div>
        <div className={"description"}>
          <p>{movieById.overview}</p>
          <button
            aria-label={
              isInWishlist ? "Remove from wishlist" : "Add to wishlist"
            }
            onClick={
              !sessionId || !accountId ? handleLogin : handleWishlistToggle
            }
            disabled={authLoading || wishlistLoading}
          >
            <Icon size={24} color={isInWishlist ? iconColor : "gray"} />
          </button>
        </div>
      </div>
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
      <div className={"info-area"} aria-label={"info-area"}>
        <a href={movieById.homepage}>Go to homepage</a>
        <p>Release date: {movieById.release_date}</p>
        <p>{currentCategory.name}</p>
      </div>
    </div>
  );
};

export default MovieDetailsPage;
