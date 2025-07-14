interface MovieProps {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
}

const MovieCard = ({ movie }: { movie: MovieProps }) => {
  console.log(movie);

  const imageUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  return (
    <div>
      {/* <div><strong>ID:</strong> {movie.id}</div> */}
      {/* {movie.title && <div><strong>Title:</strong> {movie.title}</div>} */}
      {/* {movie.overview && <div><strong>Overview:</strong> {movie.overview.slice(0, 100)}...</div>} */}
      <img src={imageUrl} alt={movie.title} style={{ width: '100px' }} />
    </div>
  )
};

export default MovieCard;
