import { MovieCardProps } from '../types.ts';

const MovieWishlistCard = ({movie, ref, onClick}: MovieCardProps) => {
  const imageUrl = `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`;

  return (
    <div
      ref={ref}
      onClick={() => onClick(movie.id)}
    >
      <img src={imageUrl} alt={movie.title} style={{ width: "150px" }} />
      <p>{movie.title}</p>
    </div>
  );
};

export default MovieWishlistCard;
