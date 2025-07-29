import { useState, useEffect } from "react";
import { Movie, Category } from "../types.ts";
import { useAuthentication } from "../hooks/useAuthentication.ts";
import { useWishlist } from "../hooks/useWishlist.ts";
import { useAccountStates } from "../hooks/useAccountStates.ts";
import Toast from "../components/Toast.tsx";

interface HeroSectionProps {
  movie: Movie;
  category: Category;
  isInWishlist: boolean;
  setIsInWishlist: (isInWishlist: boolean) => void;
}

const MovieDetailsHeroSection = ({
  movie,
  category,
  isInWishlist,
  setIsInWishlist,
}: HeroSectionProps) => {
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

  const { isMovieInWishlist, loading: accountStatesLoading } =
    useAccountStates();

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

  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!sessionId || !movie.id) {
        setIsInWishlist(false);
        return;
      }
      try {
        const inWishlist = await isMovieInWishlist({
          movieId: movie.id.toString(),
          sessionId,
        });
        setIsInWishlist(inWishlist);
      } catch (error) {
        console.error("Error checking wishlist status:", error);
        setIsInWishlist(false);
      }
    };
    checkWishlistStatus();
  }, [movie.id, sessionId]);

  const backdropUrl =
    movie.backdrop_path &&
    `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;

  const posterUrl =
    movie.poster_path && `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  const movieReleaseDate = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "";

  const heroBackdropImage = backdropUrl
    ? { backgroundImage: `url(${backdropUrl})` }
    : { backgroundColor: "#64748b" };

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
      movieId: movie.id.toString(),
      addToWishlist: !isInWishlist,
    });
    setIsInWishlist(!isInWishlist);
  };

  const Icon = category.icon;

  return (
    <>
      <section className="movie-hero">
        <div className="hero-backdrop" style={heroBackdropImage} />
        <div className="hero-content">
          <div className="movie-header">
            <div className="movie-poster">
              {posterUrl ? (
                <img src={posterUrl} alt={movie.title} loading="lazy" />
              ) : (
                <div className={"no-poster-image"} />
              )}
            </div>
            <div className="movie-info">
              <h1 className={`movie-title ${category.id}`}>{movie.title}</h1>
              {movie.tagline && (
                <p className="movie-tagline">"{movie.tagline}"</p>
              )}
              <div className="movie-meta">
                <div className="meta-item">
                  <span className="meta-icon">📅</span>
                  <span>{movieReleaseDate}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-icon">🎬</span>
                  <span>{category.name}</span>
                </div>
              </div>
              <div className="movie-actions">
                <button
                  className="wishlist-button"
                  aria-label={
                    isInWishlist ? "Remove from wishlist" : "Add to wishlist"
                  }
                  onClick={
                    !sessionId || !accountId
                      ? handleLogin
                      : handleWishlistToggle
                  }
                  disabled={
                    authLoading || wishlistLoading || accountStatesLoading
                  }
                >
                  <Icon
                    size={24}
                    color={isInWishlist ? category.iconColor : "none"}
                    border={isInWishlist ? "none" : "white"}
                  />
                  {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                </button>
                {movie.homepage && (
                  <a
                    href={movie.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="homepage-button"
                  >
                    <span className="meta-icon">🌐</span>
                    Visit Homepage
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {showWishlistToast && (
        <div className="toast-container">
          {wishlistSuccess ? (
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
          ) : null}
        </div>
      )}
      {showAuthToast && authError && (
        <div className="toast-container">
          <Toast
            message={`Auth error: ${authError}`}
            color="red"
            onClose={() => setShowAuthToast(false)}
          />
        </div>
      )}
    </>
  );
};

export default MovieDetailsHeroSection;
