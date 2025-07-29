import { forwardRef } from "react";
import { MovieCardProps } from "../types.ts";

const MovieCard = forwardRef<HTMLDivElement, MovieCardProps>(
  ({ movie, onClick }, ref) => {
    const imageUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

    return (
      <div
        data-testid={"movie-card"}
        ref={ref}
        className="item-card movie-card"
        onClick={() => onClick(movie.id)}
      >
        <img
          src={imageUrl}
          alt={movie.title}
          className="item-image movie-poster"
          loading="lazy"
        />
        <div className="item-info">
          <h3 className="item-title movie-title">{movie.title}</h3>
          <div className="item-meta movie-rating">
            <span className="star">★</span>
            <span>{movie.vote_average.toFixed(1)}</span>
          </div>
        </div>
      </div>
    );
  }
);

export default MovieCard;
