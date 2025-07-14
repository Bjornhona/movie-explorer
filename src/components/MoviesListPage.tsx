import React, { useRef, useCallback } from "react";
import { useMovies } from "../hooks/useMovies.ts";
import MovieCard from "./MovieCard.tsx";

const MoviesListPage = () => {
  const { movies, loading, error, loadMore, hasMore } = useMovies();
  const observer = useRef<IntersectionObserver | null>(null);

  // Attach observer to the last movie card (rightmost)
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

  return (
    <div style={{ padding: 16 }}>
      <h1>Movies Carousel</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          overflowX: "auto",
          gap: 16,
          padding: "16px 0",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "thin",
        }}
      >
        {movies.map((movie, idx) => (
          <div
            key={movie.id}
            ref={idx === movies.length - 1 ? lastMovieRef : undefined}
            style={{
              flex: "0 0 auto",
              scrollSnapAlign: "start",
              minWidth: 220,
              maxWidth: 220,
            }}
          >
            <MovieCard movie={movie} />
          </div>
        ))}
        {loading && movies.length > 0 && (
          <div
            style={{
              minWidth: 220,
              maxWidth: 220,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Loading more movies...
          </div>
        )}
      </div>
      {error && <div style={{ color: "red" }}>Error: {error}</div>}
      {!hasMore && <div>No more movies.</div>}
    </div>
  );
};

export default MoviesListPage;
