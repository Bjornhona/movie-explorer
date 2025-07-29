import { useRef, useCallback } from "react";
import { useAuthentication } from "../hooks/useAuthentication.ts";
import { useWishlistMovies } from "../hooks/useWishlistMovies.ts";
import { handleMovieSelection } from "../functions.ts";
import MovieWishlistCard from "./MovieWishlistCard.tsx";
import { Movie } from "../types.ts";

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

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 16 }}>
      <h1>My Wishlist</h1>
      {sessionId && accountId && movies.length === 0 && !loading && (
        <div>No movies in your wishlist yet.</div>
      )}
      {!sessionId && !accountId && (
        <>
          <p>In order to see your wishlist you must first log in</p>
          <button
            // aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            onClick={handleGetNewToken}
            disabled={authLoading || loading}
          >
            Log in
          </button>
        </>
      )}
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
      {loading && <div>Loading more movies...</div>}
      {error && <div style={{ color: "red" }}>Error: {error}</div>}
      {!hasMore && <div>No more movies.</div>}
    </div>
  );
};

export default WishlistedMoviePage;
