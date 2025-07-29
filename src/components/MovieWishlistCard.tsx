import { forwardRef } from 'react';
import { MovieCardProps } from '../types.ts';

const MovieWishlistCard = forwardRef<HTMLDivElement, MovieCardProps>(({ movie, onClick }, ref) => {
  const imageUrl = `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`;

  return (
    <div
      data-testid={'movie-wishlist-card'}
      ref={ref}
      className="item-card wishlist-card"
      onClick={() => onClick(movie.id)}
    >
      <img 
        src={imageUrl} 
        alt={movie.title} 
        className="item-image" 
        loading="lazy" 
      />
      <div className="item-info">
        <h3 className="item-title" data-testid={'movie-wishlist-title'}>
          {movie.title}
        </h3>
        <div className="item-meta">
          <span>{new Date(movie.release_date).getFullYear()}</span>
        </div>
      </div>
    </div>
  );
});

export default MovieWishlistCard;
