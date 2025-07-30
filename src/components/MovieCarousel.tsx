import { useRef, useCallback } from "react";
import { useMovies } from "../hooks/useMovies.ts";
import { Movie } from "../types.ts";
import MovieCard from "./MovieCard.tsx";
import Loading from "./Loading.tsx";
import { handleMovieSelection } from "../functions.ts";
import "../styles/components/MovieCarousel.scss";

const MovieCarousel = ({ categoryId }: { categoryId: string }) => {
  const { movies, loading, error, loadMore, hasMore } = useMovies(categoryId);
  const observer = useRef<IntersectionObserver | null>(null);

  // Attach observer to the last movie card, the node
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
    handleMovieSelection(movieId, categoryId);
  };

  return (
    <div data-testid={`carousel-${categoryId}`}>
      <div className="grid-container movies-grid">
        {movies.map((movie: Movie, idx: number) => {
          const imageRef = idx === movies.length - 1 ? lastMovieRef : undefined;

          return (
            <MovieCard
              key={movie.id}
              movie={movie}
              ref={imageRef}
              onClick={handleCardClick}
            />
          );
        })}
        {loading && movies.length > 0 && (
          <div className="loading-state">
            <Loading />
          </div>
        )}
      </div>
      {error && <div className="error-state">Error: {error}</div>}
      {!hasMore && movies.length > 0 && (
        <div className="empty-state">No more movies to load</div>
      )}
    </div>
  );
};

export default MovieCarousel;
