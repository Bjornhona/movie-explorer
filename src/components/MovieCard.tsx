import { forwardRef } from "react";
import { MovieCardProps } from "../types.ts";
import "../styles/components/MovieCard.scss";

const MovieCard = forwardRef<HTMLDivElement, MovieCardProps>(
  ({ movie, onClick }, ref) => {
    const fallbackImgPath = "/fallback.png";;
    const imageUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    const pathname = window.location.pathname;
    const isWishlist = pathname === "/wishlist";

    return (
      <div
        data-testid={"movie-card"}
        ref={ref}
        className="item-card movie-card"
        onClick={() => onClick(movie.id)}
      >
        <img
          src={imageUrl ?? fallbackImgPath}
          alt={movie.title}
          className="item-image movie-poster"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackImgPath;
          }}
        />
        <div className="item-info">
          <h3 className="item-title movie-title">{movie.title}</h3>
          <div className="item-meta movie-rating">
            {!isWishlist && <span className="star">★</span>}
            {!isWishlist && <span>{movie.vote_average.toFixed(1)}</span>}
            {isWishlist && (
              <span>{new Date(movie.release_date).getFullYear()}</span>
            )}
          </div>
        </div>
      </div>
    );
  }
);

export default MovieCard;
