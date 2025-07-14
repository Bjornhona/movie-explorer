import { Ref } from 'react';
import { Movie } from '../types.ts';

interface MovieCardProps {
  movie: Movie;
  ref: Ref<HTMLDivElement> | undefined;
  onClick: (movieId: number) => void;
}

const MovieCard = ({movie, ref, onClick}: MovieCardProps) => {
  const imageUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  return (
    <div
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
  )
}

export default MovieCard;
