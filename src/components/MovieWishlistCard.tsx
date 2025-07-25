import { forwardRef } from 'react';
import { MovieCardProps } from '../types.ts';

const MovieWishlistCard = forwardRef<HTMLDivElement, MovieCardProps>(({ movie, onClick }, ref) => {
  const imageUrl = `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`;

  return (
    <div
      data-testid={'movie-wishlist-card'}
      ref={ref}
      onClick={() => onClick(movie.id)}
    >
      <img src={imageUrl} alt={movie.title} style={{ width: "150px" }} loading="lazy" />
      <p data-testid={'movie-wishlist-title'}>{movie.title}</p>
    </div>
  );
});

export default MovieWishlistCard;
