import { forwardRef } from "react";
import { MovieCardProps } from "../types.ts";

const MovieCard = forwardRef<HTMLDivElement, MovieCardProps>(
  ({ movie, onClick }, ref) => {
    const imageUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

    return (
      <div
        data-testid={"movie-card"}
        ref={ref}
        className="movie-card"
        onClick={() => onClick(movie.id)}
      >
        <img
          src={imageUrl}
          alt={movie.title}
          className="movie-poster"
          loading="lazy"
        />
        <div className="movie-info">
          <h3 className="movie-title">{movie.title}</h3>
          <div className="movie-rating">
            <span className="star">★</span>
            <span>{movie.vote_average.toFixed(1)}</span>
          </div>
        </div>
      </div>
    );
  }
);

export default MovieCard;
