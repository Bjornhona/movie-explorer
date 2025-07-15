import { useState } from "react";
import { MovieDetailsProps } from "../types.ts";
import { useEffect } from "react";

const MovieDetailsPage = ({
  movieId,
  initialMovie,
  category,
}: MovieDetailsProps) => {
  const [movie, setMovie] = useState(initialMovie || null);
  const [loading, setLoading] = useState(!initialMovie);

  console.log(movie);
  console.log(category);
  console.log(loading);

  // useEffect(() => {
  //   if (!movie && movieId) {
  //     fetch(`/api/tmdb/movie/${movieId}`)
  //       .then((res) => res.json())
  //       .then(setMovie);
  //   }
  // }, []);

  useEffect(() => {
    if (!movie) {
      fetch(`/api/tmdb/movie/${movieId}`)
        .then(res => res.json())
        .then(setMovie)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [movieId, movie]);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <h1>{movieId}</h1>
      <p>{category}</p>
    </>
  );
};

export default MovieDetailsPage;
