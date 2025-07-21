import { useState } from "react";
import { MovieDetailsProps } from "../types.ts";
import { useEffect } from "react";
import StarIcon from './icons/StarIcon.tsx';
import HeartIcon from './icons/HeartIcon.tsx';
import BookmarkIcon from "./icons/BookmarkIcon.tsx";

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

  useEffect(() => {
    if (!movie) {
      fetch(`/api/tmdb/movie/${movieId}`)
        .then(res => res.json())
        .then(setMovie)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [movieId, movie]);

  const WishlistIcon = () => {
    switch (category) {
      case 'upcoming':
        return <HeartIcon color={'red'} />;
      case 'popular':
        return <StarIcon color={'gold'} />;
      default:
        return <BookmarkIcon color={'teal'} />;
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <h1>{movieId}</h1>
      <p>{category}</p>
      <button aria-label="Add to wishlist">
        {WishlistIcon()}
      </button>
    </>
  );
};

export default MovieDetailsPage;
