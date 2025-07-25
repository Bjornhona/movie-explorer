import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MovieDetailsPage from "../components/MovieDetailsPage.tsx";
import { Movie, MovieDetailsProps } from "../types.ts";
import { useWishlistMovies } from "../hooks/useWishlistMovies.ts";

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

vi.mock('../hooks/useAuthentication', () => ({
  useAuthentication: () => ({
    sessionId: 'fake-session-id',
    accountId: 'fake-account-id',
    loading: false,
    error: null,
    getRequestToken: vi.fn(),
    redirectToTmdbApproval: vi.fn(),
  }),
}));

vi.mock('../hooks/useMovieById', () => ({
  useMovieById: () => ({
    movieById: mockedMovie,
    loading: false,
    error: null
  })
}));

vi.mock("../hooks/useWishlist", () => ({
  useWishlist: () => ({
    addToWishlist: vi.fn(),
    loading: false,
    error: null,
    success: true,
  })
}));

vi.mock("../hooks/useWishlistMovies", () => ({
  useWishlistMovies: vi.fn()
}));

describe("Testing MovieListPage", () => {
  const moviesDetailsProps: MovieDetailsProps = {
    category: "upcoming",
    movieId: "123",
  };

  const emptyWishlistMoviesReturnValue = {
    movies: [],
    loading: false,
    error: false,
    loadMore: vi.fn(),
    hasMore: false
  }

  const movieInWishlistMoviesReturnValue = {
    ...emptyWishlistMoviesReturnValue,
    movies: [mockedMovie]
  }

  afterEach(() => vi.restoreAllMocks());

  describe("with Upcoming as category and no initial movie", () => {
    beforeEach(() => {
      (useWishlistMovies as any).mockImplementation(() => emptyWishlistMoviesReturnValue);
      vi.fn().mockResolvedValue({ json: () => Promise.resolve(mockedMovie) });
      render(<MovieDetailsPage {...moviesDetailsProps} />);
    });

    it("WHEN component renders THEN the movie title and tagline should show as a header", () => {
      const movieTitle = screen.getByText(mockedMovie.title);
      const movieTagline = screen.getByText(mockedMovie.tagline);
      expect(movieTitle).toBeInTheDocument();
      expect(movieTagline).toBeInTheDocument();
    });

    it("WHEN component renders THEN the movie image should show", () => {
      const imageUrl = `https://image.tmdb.org/t/p/w500${mockedMovie.backdrop_path}`;
      const image = screen.getByRole("img", { name: mockedMovie.title });
      expect(image).toBeInTheDocument();
      expect(image.getAttribute("src")).toEqual(imageUrl);
    });

    it("WHEN component renders THEN the movie description should show", () => {
      const description = screen.getByText(mockedMovie.overview);
      expect(description).toBeInTheDocument();
    });

    it("WHEN component renders THEN a wishlist button should show", () => {
      const wishlistButton = screen.getByLabelText(/add to wishlist/i);
      expect(wishlistButton).toBeInTheDocument();
    });

    it("WHEN clicking the wishlist button THEN the movie should be added to wishlist", async () => {
      const wishlistButton = screen.getByLabelText(/add to wishlist/i);
      const wishlistIcon = wishlistButton.querySelector("svg");
      expect(wishlistIcon).toHaveAttribute("stroke", "gray");

      await fireEvent.click(wishlistButton);
      (useWishlistMovies as any).mockReturnValue(movieInWishlistMoviesReturnValue);
      render(<MovieDetailsPage {...moviesDetailsProps} />);

      expect(wishlistIcon).toHaveAttribute("stroke", "red");
    });

    it("WHEN component renders THEN an additional info area should show", () => {
      const linkToHomepage = screen.getByRole("link", {
        name: /go to homepage/i,
      });
      expect(linkToHomepage).toBeInTheDocument();

      const releaseDate = screen.getByText('Release date: ' + mockedMovie.release_date);
      expect(releaseDate).toBeInTheDocument();
    });

    it("GIVEN a category WHEN component renders THEN the category should show in the additional info area", () => {
      const movieCategory = screen.getByText(moviesDetailsProps.category);
      expect(movieCategory).toBeInTheDocument();
    });

    it("GIVEN the Upcoming movie category WHEN component renders THEN a specific font should show", () => {
      const title = screen.getByText(mockedMovie.title);
      const style = window.getComputedStyle(title);
      expect(style.fontFamily).toMatch(/Raleway/i);
    });

    it("GIVEN the Upcoming movie category WHEN component renders THEN the heart icon button should show", () => {
      expect(screen.getByLabelText("heart-icon")).toBeInTheDocument();
    });

    it("GIVEN the Upcoming movie category WHEN component renders THEN a specific background color should show", () => {
      const container = screen.getByTestId("movie-details");
      expect(container).toHaveStyle("background-color: rgb(255, 192, 203)");
    });
  });

  describe("with Popular as category and initialMovie given", () => {
    const moviesDetailsPropsPopular: MovieDetailsProps = {
      ...moviesDetailsProps,
      category: "popular",
    };

    beforeEach(() => {
      (useWishlistMovies as any).mockImplementation(() => emptyWishlistMoviesReturnValue);
      render(<MovieDetailsPage {...moviesDetailsPropsPopular} />);
    });

    it("GIVEN the Popular movie category WHEN component renders THEN a specific font should show", () => {
      const title = screen.getByText(mockedMovie.title);
      const style = window.getComputedStyle(title);
      expect(style.fontFamily).toMatch(/Poppins/i);
    });

    it("GIVEN the Popular movie category WHEN component renders THEN the star icon button should show", () => {
      expect(screen.getByLabelText("star-icon")).toBeInTheDocument();
    });
  });
});
