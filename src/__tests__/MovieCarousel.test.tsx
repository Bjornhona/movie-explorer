import { render, screen, fireEvent } from '@testing-library/react';
import MovieCarousel from '../components/MovieCarousel.tsx';
import { Movie } from '../types.ts';
import * as functions from '../functions.ts';
import { useMovies } from '../hooks/useMovies.ts';

vi.mock('../hooks/useMovies', () => ({
  useMovies: vi.fn()
}));

vi.mock('../functions', () => ({
  handleMovieSelection: vi.fn(),
}));

describe('MovieCarousel', () => {
  const mockedMovies: Movie[] = [
    {
      id: 123,
      title: 'Movie One',
      overview: 'Overview 1',
      poster_path: '/poster1.jpg',
      tagline: 'Some test 1 tagline',
      backdrop_path: '/backdrop1.jpg',
      release_date: '2023-01-01',
      homepage: 'https://some-test-homepage-path.com'
    },
    {
      id: 234,
      title: 'Movie Two',
      overview: 'Overview 2',
      poster_path: '/poster2.jpg',
      tagline: 'Some test 2 tagline',
      backdrop_path: '/backdrop2.jpg',
      release_date: '2023-01-02',
      homepage: 'https://some-other-test-homepage-path.com'
    },
  ];

  const mockedUseMovies = {
    movies: mockedMovies,
    loading: false,
    error: null,
    loadMore: vi.fn(),
    hasMore: false,
  }

  const movieCarouselProps = {
    title: 'Popular',
    category: 'popular'
  }
  describe('with movie list and no errors', () => {
    beforeEach(() => {
      (useMovies as any).mockReturnValue(mockedUseMovies);
      render(<MovieCarousel {...movieCarouselProps} />);
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('WHEN component renders THEN the carousel title should show', () => {
      const title = screen.getByRole('heading', { name: movieCarouselProps.title, level: 4 });
      expect(title).toBeInTheDocument();
    });

    it('WHEN component renders THEN a list of movie cards should show', () => {
      const cards = screen.getAllByTestId('movie-card');
      expect(cards).toHaveLength(mockedMovies.length);

      mockedMovies.forEach((movie) => {
        const image = screen.getByAltText(movie.title);
        expect(image).toBeInTheDocument();
      });
    });

    it('WHEN clicking on a movie card THEN the handleMovieSelection function should be called', () => {
      const cards = screen.getAllByTestId('movie-card');
      fireEvent.click(cards[0]);
      expect(functions.handleMovieSelection).toHaveBeenCalled();
      expect(functions.handleMovieSelection).toHaveBeenCalledWith(mockedMovies[0].id, movieCarouselProps.category);
    });

    it("GIVEN a movies list WHEN component renders and no more movies in list THEN a message should show", () => {
      const message = screen.getByText('No more movies.');
      expect(message).toBeInTheDocument();
    });
  });

  describe('when error message exists', () => {
    const useMovieslistWithError = {
      ...mockedUseMovies,
      error: 'Some test error message',
    };

    it("GIVEN an error message WHEN component renders THEN that error message should show", () => {
      (useMovies as any).mockReturnValue(useMovieslistWithError);
      render(<MovieCarousel {...movieCarouselProps} />);
      const errorMessage = screen.getByText('Error: ' + useMovieslistWithError.error);
      expect(errorMessage).toBeInTheDocument();
    });
  });
});
