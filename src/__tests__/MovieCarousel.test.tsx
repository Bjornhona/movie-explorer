import { render, screen, fireEvent, act } from "@testing-library/react";
import MovieCarousel from "../components/MovieCarousel.tsx";
import { Movie } from "../types.ts";
import * as functions from "../functions.ts";
import { useMovies } from "../hooks/useMovies.ts";

vi.mock("../hooks/useMovies", () => ({
  useMovies: vi.fn(),
}));

vi.mock("../functions", () => ({
  handleMovieSelection: vi.fn(),
}));

describe("MovieCarousel", () => {
  const mockedMovies: Movie[] = [
    {
      id: 123,
      title: "Movie One",
      overview: "Overview 1",
      poster_path: "/poster1.jpg",
      tagline: "Some test 1 tagline",
      backdrop_path: "/backdrop1.jpg",
      release_date: "2023-01-01",
      homepage: "https://some-test-homepage-path.com",
      vote_average: 3.456,
    },
    {
      id: 234,
      title: "Movie Two",
      overview: "Overview 2",
      poster_path: "/poster2.jpg",
      tagline: "Some test 2 tagline",
      backdrop_path: "/backdrop2.jpg",
      release_date: "2023-01-02",
      homepage: "https://some-other-test-homepage-path.com",
      vote_average: 2.345,
    },
  ];

  const mockedUseMovies = {
    movies: mockedMovies,
    loading: false,
    error: null,
    loadMore: vi.fn(),
    hasMore: false,
  };

  const movieCarouselProps = {
    categoryId: "popular",
  };

  describe("with movie list and no errors", () => {
    beforeEach(() => {
      (useMovies as any).mockReturnValue(mockedUseMovies);
      render(<MovieCarousel {...movieCarouselProps} />);
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("WHEN component renders THEN a list of movie cards should show", () => {
      const cards = screen.getAllByTestId("movie-card");
      expect(cards).toHaveLength(mockedMovies.length);

      mockedMovies.forEach((movie) => {
        const image = screen.getByAltText(movie.title);
        expect(image).toBeInTheDocument();
      });
    });

    it("WHEN clicking on a movie card THEN the handleMovieSelection function should be called", () => {
      const cards = screen.getAllByTestId("movie-card");
      act(() => {
        fireEvent.click(cards[0]);
      });
      expect(functions.handleMovieSelection).toHaveBeenCalled();
      expect(functions.handleMovieSelection).toHaveBeenCalledWith(
        mockedMovies[0].id,
        movieCarouselProps.categoryId
      );
    });

    it("GIVEN a movies list WHEN component renders and no more movies in list THEN a message should show", () => {
      const message = screen.getByText("No more movies to load");
      expect(message).toBeInTheDocument();
    });

    it("GIVEN no error message WHEN component renders THEN an error message should not show", () => {
      const errorMessage = screen.queryByText(
        "Error: " + mockedUseMovies.error
      );
      expect(errorMessage).not.toBeInTheDocument();
    });
  });

  describe("when error message exists", () => {
    const useMovieslistWithError = {
      ...mockedUseMovies,
      error: "Some test error message",
    };

    it("GIVEN an error message WHEN component renders THEN that error message should show", () => {
      (useMovies as any).mockReturnValue(useMovieslistWithError);
      render(<MovieCarousel {...movieCarouselProps} />);
      const errorMessage = screen.getByText(
        "Error: " + useMovieslistWithError.error
      );
      expect(errorMessage).toBeInTheDocument();
    });
  });

  describe("when loading movies", () => {
    const useMovieslistWhileLoadingMore = {
      ...mockedUseMovies,
      loading: true,
    };

    it("GIVEN loading more movies WHEN component renders THEN loading more should show", () => {
      (useMovies as any).mockReturnValue(useMovieslistWhileLoadingMore);
      render(<MovieCarousel {...movieCarouselProps} />);
      const loadingMoreComponent = screen.getByTestId(
        "loading-more-component"
      );
      expect(loadingMoreComponent).toBeInTheDocument();
    });
  });
});
