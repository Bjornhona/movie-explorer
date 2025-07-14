import React, { useRef, useCallback } from "react";
import { useMovies } from "../hooks/useMovies.ts";
import { Movie } from '../types.ts';

const MovieCarousel = ({ title, category }: { title: string; category: string }) => {
    const { movies, loading, error, loadMore, hasMore } = useMovies(category);
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
  console.log(movies);

  return (
        <div style={{ padding: 16 }}>
          <h4>{title}</h4>
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
            {movies.map((movie: Movie, idx: number) => {
              const imageUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

              return (
                <div
                  key={movie.id}
                  ref={idx === movies.length - 1 ? lastMovieRef : undefined}
                  style={{
                    flex: "0 0 auto",
                    scrollSnapAlign: "start",
                    minWidth: 150,
                    maxWidth: 150,
                  }}
                >
                  {/* <MovieCarousel movie={movie} /> */}
                  {/* <div> */}
                    {/* <div><strong>ID:</strong> {movie.id}</div> */}
                    {/* {movie.title && <div><strong>Title:</strong> {movie.title}</div>} */}
                    {/* {movie.overview && <div><strong>Overview:</strong> {movie.overview.slice(0, 100)}...</div>} */}
                    <img src={imageUrl} alt={movie.title} style={{ width: '150px' }} />
                  {/* </div> */}
                </div>
              )
            })}
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
  )
};

export default MovieCarousel;
