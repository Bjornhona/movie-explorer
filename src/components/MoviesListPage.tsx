import MovieCarousel from "./MovieCarousel.tsx";

const MoviesListPage = () => {
  return (
    <div style={{ padding: 16 }}>
      <h2>Movies</h2>
      <MovieCarousel title={"Upcoming"} category={"upcoming"} />
      <MovieCarousel title={"Popular"} category={"popular"} />
      <MovieCarousel title={"Top Rated"} category={"top_rated"} />
    </div>
  );
};

export default MoviesListPage;
