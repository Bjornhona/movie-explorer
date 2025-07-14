// import React, { useRef, useCallback } from "react";
// import { useMovies } from "../hooks/useMovies.ts";
import MovieCarousel from "./MovieCarousel.tsx";

// const Carousel = ({ title, category }: { title: string; category: string }) => {
//   const { movies, loading, error, loadMore, hasMore } = useMovies(category);
//   const observer = useRef<IntersectionObserver | null>(null);

//   const lastMovieRef = useCallback(
//     (node: HTMLDivElement | null) => {
//       if (loading) return;
//       if (observer.current) observer.current.disconnect();
//       observer.current = new IntersectionObserver(
//         entries => {
//           if (entries[0].isIntersecting && hasMore && !loading) {
//             loadMore();
//           }
//         },
//         { root: null, rootMargin: "0px", threshold: 1.0 }
//       );
//       if (node) observer.current.observe(node);
//     },
//     [loading, hasMore, loadMore]
//   );

//   return (
//     <div style={{ marginBottom: 40 }}>
//       <h2>{title}</h2>
//       <div
//         style={{
//           display: "flex",
//           flexDirection: "row",
//           overflowX: "auto",
//           gap: 16,
//           padding: "16px 0",
//           scrollSnapType: "x mandatory",
//           scrollbarWidth: "thin",
//         }}
//       >
//         {movies.map((movie, idx) => (
//           <div
//             key={movie.id}
//             ref={idx === movies.length - 1 ? lastMovieRef : undefined}
//             style={{
//               flex: "0 0 auto",
//               scrollSnapAlign: "start",
//               minWidth: "clamp(160px, 30vw, 220px)",
//               maxWidth: "90vw",
//               width: "100%",
//             }}
//           >
//             <MovieCard movie={movie} />
//           </div>
//         ))}
//         {loading && movies.length > 0 && (
//           <div
//             style={{
//               minWidth: "clamp(160px, 30vw, 220px)",
//               maxWidth: "90vw",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             Loading more movies...
//           </div>
//         )}
//       </div>
//       {error && <div style={{ color: "red" }}>Error: {error}</div>}
//       {!hasMore && <div>No more movies.</div>}
//     </div>
//   );
// };

const MoviesListPage = () => {
  return (
    <div style={{ padding: 16 }}>
      <h4>Movies</h4>
      {/* <MovieCarousel /> */}
      <MovieCarousel title={"Now Playing"} category={"now_playing"} />
      <MovieCarousel title="Popular" category="popular" />
      <MovieCarousel title="Top Rated" category="top_rated" />
    </div>
  );
};

export default MoviesListPage;
