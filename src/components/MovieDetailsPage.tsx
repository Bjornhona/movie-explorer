import { MovieDetailsProps } from '../types.ts';

const MovieDetailsPage = ({movieId, category}: MovieDetailsProps) => {
  console.log(movieId);
  console.log(category);
  
  return (
    <>
      <h1>Movie ID: {movieId}</h1>
      <p>{category}</p>
    </>
  )
}

export default MovieDetailsPage;
