interface MovieProps {
  movieId: string
}

const MoviePage = ({movieId}: MovieProps) => {
  return (
    <h1>Movie ID: {movieId}</h1>
  )
}

export default MoviePage;
