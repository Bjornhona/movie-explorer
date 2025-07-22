import { useState } from "react";
import { MovieDetailsProps } from "../types.ts";
import { useEffect } from "react";
import StarIcon from './icons/StarIcon.tsx';
import HeartIcon from './icons/HeartIcon.tsx';
import BookmarkIcon from "./icons/BookmarkIcon.tsx";
import { getBackgroundColor } from "../functions.ts";
import { useAuthentication } from '../hooks/useAuthentication.ts';
import { BASE_URL } from '../constants.ts';

const MovieDetailsPage = ({
  movieId,
  initialMovie,
  category,
}: MovieDetailsProps) => {
  const { requestToken } = useAuthentication();
  const [movie, setMovie] = useState(initialMovie || null);
  const [loading, setLoading] = useState(!initialMovie);

  console.log(movie);
  console.log(category);

  useEffect(() => {
    if (!movie) {
      fetch(`/api/tmdb/movie/${movieId}`)
        .then(res => res.json())
        .then(setMovie)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [movieId, movie]);

  const getWishlistIcon = () => {
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
    <div data-testid={'movie-details'} style={{ backgroundColor: getBackgroundColor(category) }}>
      <h1>{movie?.title}</h1>
      <p>{category}</p>
      <a href={`https://www.themoviedb.org/authenticate/${requestToken}?redirect_to=${BASE_URL}/approved`}>
        <button aria-label="Add to wishlist">
          {getWishlistIcon()}
        </button>
      </a>
    </div>
  );
};

export default MovieDetailsPage;
