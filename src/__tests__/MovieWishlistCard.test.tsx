import MovieWishlistCard from "../components/MovieWishlistCard.tsx";
import { render, screen, fireEvent} from "@testing-library/react";
import { MovieCardProps, Movie } from '../types.ts';

describe('Testing MovieWishlistCard', () => {
  const mockedMovie: Movie = {
    id: 123,
    title: "Movie One",
    overview: "Test description text",
    tagline: "When masters unite a new legacy begins.",
    poster_path: "/test-poster.jpg",
    backdrop_path: "/test-backdrop.jpg",
    release_date: '1974-12-20',
    homepage: 'https://link.to.some.movies.page.com'
  };

  const MovieWishlistCardProps: MovieCardProps = {
    movie: mockedMovie,
    onClick: vi.fn()
  }
  beforeEach(() => {
    render(<MovieWishlistCard {...MovieWishlistCardProps} />);
  });

  afterEach(() => vi.restoreAllMocks());

  it('WHEN component renders THEN a movie wishlist card should show', () => {
    const movieWishlistCard = screen.getByTestId('movie-wishlist-card');
    expect(movieWishlistCard).toBeInTheDocument();
  });

  it('WHEN component renders THEN a movie image should show', () => {
    const imageUrl = `https://image.tmdb.org/t/p/w500${MovieWishlistCardProps.movie.backdrop_path}`;
    const movieWishlistCard = screen.getByRole('img', {name: MovieWishlistCardProps.movie.title});
    expect(movieWishlistCard).toBeInTheDocument();
    expect(movieWishlistCard).toHaveAttribute("src", imageUrl);
  });

  it('WHEN component renders THEN a movie title should show', () => {
    const movieWishlistCard = screen.getByText(MovieWishlistCardProps.movie.title);
    expect(movieWishlistCard).toBeInTheDocument();
  });

  it('WHEN clicking the card THEN the onClick should be called with movieId', () => {
    const movieWishlistCard = screen.getByTestId('movie-wishlist-card');
    fireEvent.click(movieWishlistCard);
    expect(MovieWishlistCardProps.onClick).toHaveBeenCalledWith(MovieWishlistCardProps.movie.id);
  });  
});
