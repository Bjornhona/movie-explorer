import MovieCarousel from "./MovieCarousel.tsx";
import { CATEGORIES } from "../constants.ts";

const MoviesListPage = () => {
  return (
    <div style={{ padding: 16 }}>
      <h2>Movies</h2>
      {CATEGORIES.map((category) => (
        <MovieCarousel
          key={category.id}
          title={category.name}
          categoryId={category.id}
        />
      ))}
    </div>
  );
};

export default MoviesListPage;
