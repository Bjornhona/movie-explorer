import { forwardRef } from 'react';
import { MovieCardProps } from '../types.ts';

const MovieCard = forwardRef<HTMLDivElement, MovieCardProps>(({ movie, onClick }, ref) => {
  const imageUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  return (
    <div
      data-testid={'movie-card'}
      ref={ref}
      style={{
        flex: "0 0 auto",
        scrollSnapAlign: "start",
        minWidth: 150,
        maxWidth: 150,
      }}
      onClick={() => onClick(movie.id)}
    >
      <img
        src={imageUrl}
        alt={movie.title}
        style={{ width: "150px" }}
      />
    </div>
  );
});

export default MovieCard;
