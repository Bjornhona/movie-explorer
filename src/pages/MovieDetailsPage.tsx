import { useState, useEffect, useMemo } from "react";
import { useAuthentication } from "../hooks/useAuthentication.ts";
import { useMovieById } from "../hooks/useMovieById.ts";
import { useWishlist } from "../hooks/useWishlist.ts";
import Toast from "../components/Toast.tsx";
import { CATEGORIES } from "../constants.ts";
import { Category } from "../types.ts";
import { useAccountStates } from "../hooks/useAccountStates.ts";
import "../styles/pages/MovieDetailsPage.scss";

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
  const { isMovieInWishlist, loading: accountStatesLoading } =
    useAccountStates();
  const [showWishlistToast, setShowWishlistToast] = useState(false);
  const [showAuthToast, setShowAuthToast] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!sessionId || !movieId) {
        setIsInWishlist(false);
        return;
      }
      try {
        const inWishlist = await isMovieInWishlist({ movieId, sessionId });
        setIsInWishlist(inWishlist);
      } catch (error) {
        console.error("Error checking wishlist status:", error);
        setIsInWishlist(false);
      }
    };
    checkWishlistStatus();
  }, [movieId, sessionId]);

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
    setIsInWishlist(!isInWishlist);
  };

  // Loading State
  if (movieLoading) {
    return (
      <div className="movie-details-page">
        <div className="movie-loading fade-in">
          <div className="card-content">
            <div className="loading-spinner">
              <div>Loading movie details...</div>
            </div>
            <p className="loading-text">Please wait while we fetch the movie information</p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (movieError) {
    return (
      <div className="movie-details-page">
        <div className="movie-error fade-in">
          <div className="card-content">
            <div className="error-icon">⚠️</div>
            <h3 className="error-title">Error Loading Movie</h3>
            <p className="error-description">{movieError}</p>
            <button className="retry-button" onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Not Found State
  if (!movieById) {
    return (
      <div className="movie-details-page">
        <div className="movie-error fade-in">
          <div className="card-content">
            <div className="error-icon">🔍</div>
            <h3 className="error-title">Movie Not Found</h3>
            <p className="error-description">The movie you're looking for doesn't exist or has been removed.</p>
            <button className="retry-button" onClick={() => window.history.back()}>
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const backdropUrl = `https://image.tmdb.org/t/p/original${movieById.backdrop_path}`;
  const posterUrl = `https://image.tmdb.org/t/p/w500${movieById.poster_path}`;
  const Icon = currentCategory.icon;

  return (
    <div className="movie-details-page">
      {/* Hero Section with Movie Backdrop */}
      <section className="movie-hero">
        <div 
          className="hero-backdrop"
          style={{ backgroundImage: `url(${backdropUrl})` }}
        />
        <div className="hero-content">
          <div className="movie-header">
            <div className="movie-poster">
              <img src={posterUrl} alt={movieById.title} loading="lazy" />
            </div>
            <div className="movie-info">
              <h1 
                className={`movie-title ${currentCategory.id}`}
              >
                {movieById.title}
              </h1>
              {movieById.tagline && (
                <p className="movie-tagline">"{movieById.tagline}"</p>
              )}
              <div className="movie-meta">
                <div className="meta-item">
                  <span className="meta-icon">📅</span>
                  <span>{new Date(movieById.release_date).getFullYear()}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-icon">🎬</span>
                  <span>{currentCategory.name}</span>
                </div>
              </div>
              <div className="movie-actions">
                <button
                  className="wishlist-button"
                  aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                  onClick={!sessionId || !accountId ? handleLogin : handleWishlistToggle}
                  disabled={authLoading || wishlistLoading || accountStatesLoading}
                >
                  <Icon size={24} color={isInWishlist ? currentCategory.iconColor : 'none'} border={isInWishlist ? 'none' : 'white'} />
                  {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                </button>
                {movieById.homepage && (
                  <a 
                    href={movieById.homepage} 
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

      {/* Main Content */}
      <main className={`movie-content bg-${currentCategory.id}`}>
        <div className="content-wrapper">
          <div className="main-section">
            {/* Overview Section */}
            <section className="overview-section fade-in">
              <div className="card-header">
                <h2>
                  <span className="card-icon">📖</span>
                  Overview
                </h2>
              </div>
              <div className="card-content">
                <p className="overview-text">{movieById.overview}</p>
              </div>
            </section>

            {/* Category Section */}
            <section className="category-section fade-in">
              <div className="card-header">
                <h2>
                  <span className="card-icon">🎭</span>
                  Category
                </h2>
              </div>
              <div className="card-content">
                <div className="category-info">
                  <div className="category-icon">
                    <Icon size={24} color="white" />
                  </div>
                  <div className="category-details">
                    <h3 className="category-name">{currentCategory.name}</h3>
                    <p className="category-description">
                      {categoryId === 'upcoming' && 'Coming soon to theaters near you'}
                      {categoryId === 'popular' && 'Trending movies everyone is talking about'}
                      {categoryId === 'top_rated' && 'Critically acclaimed masterpieces'}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="sidebar">
            {/* Movie Details Card */}
            <section className="movie-details-card fade-in">
              <div className="card-header">
                <h2>
                  <span className="card-icon">ℹ️</span>
                  Movie Details
                </h2>
              </div>
              <div className="card-content">
                <ul className="details-list">
                  <li className="detail-item">
                    <span className="detail-label">Title</span>
                    <span className="detail-value">{movieById.title}</span>
                  </li>
                  <li className="detail-item">
                    <span className="detail-label">Release Date</span>
                    <span className="detail-value">
                      {new Date(movieById.release_date).toLocaleDateString()}
                    </span>
                  </li>
                  <li className="detail-item">
                    <span className="detail-label">Category</span>
                    <span className="detail-value">{currentCategory.name}</span>
                  </li>
                  {movieById.homepage && (
                    <li className="detail-item">
                      <span className="detail-label">Homepage</span>
                      <span className="detail-value">
                        <a 
                          href={movieById.homepage} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ color: 'inherit', textDecoration: 'underline' }}
                        >
                          Visit
                        </a>
                      </span>
                    </li>
                  )}
                </ul>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Toast Notifications */}
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
    </div>
  );
};

export default MovieDetailsPage;
