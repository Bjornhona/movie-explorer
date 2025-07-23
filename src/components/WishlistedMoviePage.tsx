import { useRef, useCallback } from "react";
import { useAuthentication } from "../hooks/useAuthentication.ts";
import { useWishlistMovies } from "../hooks/useWishlistMovies.ts";
import { handleMovieSelection } from '../functions.ts';
import { Movie } from '../types.ts';

const WishlistedMoviePage = () => {
  const { accountId, sessionId } = useAuthentication();
  const { movies, loading, error, loadMore, hasMore } = useWishlistMovies(accountId, sessionId);
  const observer = useRef<IntersectionObserver | null>(null);

  const lastMovieRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        entries => {
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
    handleMovieSelection(movieId, 'popular');
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 16 }}>
      <h1>My Wishlist</h1>
      {movies.length === 0 && !loading && <div>No movies in your wishlist.</div>}
      {movies.map((movie: Movie, idx: number) => {
        const imageUrl = `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`;
        return (
          <div
            key={movie.id}
            ref={idx === movies.length - 1 ? lastMovieRef : undefined}
            onClick={() => handleCardClick(movie.id)}
          >
            {/* <MovieCard movie={movie} /> */}
            <img
              src={imageUrl}
              alt={movie.title}
              style={{ width: "150px" }}
            />
          </div>
        )
      })}
      {loading && <div>Loading more movies...</div>}
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      {!hasMore && <div>No more movies.</div>}
    </div>
  );
};

export default WishlistedMoviePage; 