import { Movie } from "./types.ts";

export const handleMovieSelection = (movieId: number, categoryId: string) => {
  window.history.pushState({}, "", `/${categoryId}/${movieId}`);
  window.dispatchEvent(new PopStateEvent("popstate"));
};

export const getStats = (movies: Movie[]) => {
    const years = movies.map((movie: Movie) =>
    new Date(movie.release_date).getFullYear()
  );
  const decades = movies.map((movie: Movie) => movie.release_date.split("-")[0]);

  const stats = [
    {
      name: "Movies",
      number: movies.length,
    },
    {
      name: "Years",
      number: movies.length > 0 ? new Set(years).size : "0",
    },
    {
      name: "Decades",
      number: movies.length > 0 ? new Set(decades).size : "0",
    },
  ];
  return stats;
}