import { useRef, useCallback } from "react";
import Button from "../components/Button.tsx";
import Card from "../components/Card.tsx";
import { useAuthentication } from "../hooks/useAuthentication.ts";
import { useWishlistMovies } from "../hooks/useWishlistMovies.ts";
import { handleMovieSelection } from "../functions.ts";
import MovieCard from "../components/MovieCard.tsx";
import { Movie } from "../types.ts";
import "../styles/pages/WishlistPage.scss";
import { getStats } from "../functions.ts";

const WishlistedMoviePage = () => {
  const {
    loading: authLoading,
    accountId,
    sessionId,
    getRequestToken,
    redirectToTmdbApproval,
  } = useAuthentication();
  const { movies, error, loading, loadMore, hasMore } = useWishlistMovies(
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

  const stats = getStats(movies);

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
            <Card icon={"🔐"} title={"Authentication Required"}>
              <p className="auth-message">
                To view your wishlist, you need to be logged in with your TMDB
                account.
              </p>
              <Button
                text={authLoading ? "Connecting..." : "Login with TMDB"}
                disabled={authLoading}
                onClick={handleGetNewToken}
              />
            </Card>
          )}

          {/* Loading State */}
          {authLoading && (
            <Card>
              <div className="loading-spinner">
                <div>Loading authentication...</div>
              </div>
              <p className="loading-text">
                Please wait while we connect to TMDB
              </p>
            </Card>
          )}

          {/* Error State */}
          {error && (
            <Card>
              <div className="error-icon">⚠️</div>
              <h3 className="error-title">Error Loading Wishlist</h3>
              <p className="error-description">{error}</p>
              <Button
                text={"Try Again"}
                onClick={handleGetNewToken}
                type={"secondary"}
              />
            </Card>
          )}

          {/* Wishlist Content */}
          {sessionId && accountId && (
            <Card title={"My Wishlist"} icon={"❤️"}>
              <div className="wishlist-stats">
                {stats.map((stat, index) => (
                  <div key={index} className="stat-item">
                    <span className="stat-number">{stat.number}</span>
                    <span className="stat-label">{stat.name}</span>
                  </div>
                ))}
              </div>

              {/* Empty Wishlist */}
              {movies.length === 0 && !loading && (
                <div className="empty-wishlist">
                  <div className="card-content">
                    <div className="empty-icon">📽️</div>
                    <h3 className="empty-title">Your wishlist is empty</h3>
                    <p className="empty-description">
                      Start building your collection by browsing movies and
                      adding them to your wishlist.
                    </p>
                    <button
                      className="browse-button"
                      onClick={() => (window.location.href = "/")}
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
                    const movieRef =
                      idx === movies.length - 1 ? lastMovieRef : undefined;
                    return (
                      <MovieCard
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
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default WishlistedMoviePage;
