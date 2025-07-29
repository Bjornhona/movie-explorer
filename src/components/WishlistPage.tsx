import { useRef, useCallback } from "react";
import { useAuthentication } from "../hooks/useAuthentication.ts";
import { useWishlistMovies } from "../hooks/useWishlistMovies.ts";
import { handleMovieSelection } from "../functions.ts";
import MovieWishlistCard from "./MovieWishlistCard.tsx";
import { Movie } from "../types.ts";
import "../styles/WishlistPage.scss";

const WishlistedMoviePage = () => {
  const {
    loading: authLoading,
    accountId,
    sessionId,
    getRequestToken,
    redirectToTmdbApproval,
  } = useAuthentication();
  const { movies, loading, error, loadMore, hasMore } = useWishlistMovies(
    accountId,
    sessionId
  );

  const observer = useRef<IntersectionObserver | null>(null);

  const handleGetNewToken = async () => {
    const requestToken = await getRequestToken();
    if (requestToken) {
      const redirectUrl =
        window.location.origin +
        window.location.pathname +
        window.location.search;
      redirectToTmdbApproval(requestToken, redirectUrl);
    }
  };

  const lastMovieRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !loading) {
            loadMore();
          }
        },
        { root: null, rootMargin: "0px", threshold: 1.0 }
      );
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, loadMore]
  );

  const handleCardClick = (movieId: number) => {
    handleMovieSelection(movieId, "popular");
  };

  return (
    <div className="wishlist-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>My Wishlist</h1>
          <p className="hero-subtitle">
            Your personal collection of movies you want to watch
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-wrapper">
          {/* Authentication Required */}
          {!sessionId && !accountId && (
            <section className="auth-section fade-in">
              <div className="card-header">
                <h2>
                  <span className="card-icon">🔐</span>
                  Authentication Required
                </h2>
              </div>
              <div className="card-content">
                <p className="auth-message">
                  To view your wishlist, you need to be logged in with your TMDB account.
                </p>
                <button
                  className="auth-button"
                  onClick={handleGetNewToken}
                  disabled={authLoading}
                >
                  {authLoading ? "Connecting..." : "Login with TMDB"}
                </button>
              </div>
            </section>
          )}

          {/* Loading State */}
          {authLoading && (
            <section className="wishlist-loading fade-in">
              <div className="card-content">
                <div className="loading-spinner">
                  <div>Loading authentication...</div>
                </div>
                <p className="loading-text">Please wait while we connect to TMDB</p>
              </div>
            </section>
          )}

          {/* Error State */}
          {error && (
            <section className="wishlist-error fade-in">
              <div className="card-content">
                <div className="error-icon">⚠️</div>
                <h3 className="error-title">Error Loading Wishlist</h3>
                <p className="error-description">
                  {error}
                </p>
                <button className="retry-button" onClick={handleGetNewToken}>
                  Try Again
                </button>
              </div>
            </section>
          )}

          {/* Wishlist Content */}
          {sessionId && accountId && (
            <section className="wishlist-section fade-in">
              <div className="card-header">
                <h2>
                  <span className="card-icon">❤️</span>
                  My Wishlist
                </h2>
              </div>
              <div className="card-content">
                {/* Wishlist Stats */}
                <div className="wishlist-stats">
                  <div className="stat-item">
                    <span className="stat-number">{movies.length}</span>
                    <span className="stat-label">Movies</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">
                      {movies.length > 0 
                        ? new Set(movies.map(movie => new Date(movie.release_date).getFullYear())).size
                        : '0'
                      }
                    </span>
                    <span className="stat-label">Years</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">
                      {movies.length > 0 
                        ? new Set(movies.map(movie => movie.release_date.split('-')[0])).size
                        : '0'
                      }
                    </span>
                    <span className="stat-label">Decades</span>
                  </div>
                </div>

                {/* Empty Wishlist */}
                {movies.length === 0 && !loading && (
                  <div className="empty-wishlist">
                    <div className="card-content">
                      <div className="empty-icon">📽️</div>
                      <h3 className="empty-title">Your wishlist is empty</h3>
                      <p className="empty-description">
                        Start building your collection by browsing movies and adding them to your wishlist.
                      </p>
                      <button 
                        className="browse-button"
                        onClick={() => window.location.href = '/'}
                      >
                        Browse Movies
                      </button>
                    </div>
                  </div>
                )}

                {/* Movies Grid */}
                {movies.length > 0 && (
                  <div className="grid-container wishlist-grid">
                    {movies.map((movie: Movie, idx: number) => {
                      const movieRef = idx === movies.length - 1 ? lastMovieRef : undefined;
                      return (
                        <MovieWishlistCard
                          key={movie.id}
                          movie={movie}
                          ref={movieRef}
                          onClick={handleCardClick}
                        />
                      );
                    })}
                    {loading && (
                      <div className="loading-state">
                        <div>Loading more movies...</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default WishlistedMoviePage;
