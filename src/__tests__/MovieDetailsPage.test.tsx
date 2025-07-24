import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MovieDetailsPage from "../components/MovieDetailsPage.tsx";
import { MovieDetailsProps } from "../types.ts";

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
    movieById: {id: 123, title: 'Movie One'},
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

describe("Testing MovieListPage", () => {
  const moviesDetailsProps: MovieDetailsProps = {
    category: "Upcoming",
    movieId: "123",
  };
  const mockedMovie = {
    id: 123,
    title: "Test movie title",
    overview: "Test description text",
    tagline: "When masters unite a new legacy begins.",
    poster_path: "/test-poster.jpg",
    backdrop_path: "/test-backdrop.jpg",
    release_date: new Date(),
  };

  describe("with Upcoming as category and no initial movie", () => {
    beforeEach(() => {
      vi.fn().mockResolvedValue({ json: () => Promise.resolve(mockedMovie) });
      render(<MovieDetailsPage {...moviesDetailsProps} />);
    });

    afterEach(() => vi.restoreAllMocks());

    it("WHEN component renders THEN the movie title and tagline should show as a header", async () => {
      await waitFor(() => {
        const movieTitle = screen.getByText(mockedMovie.title);
        const movieTagline = screen.getByText(mockedMovie.tagline);
        expect(movieTitle).toBeInTheDocument();
        expect(movieTagline).toBeInTheDocument();
      });
    });

    it("WHEN component renders THEN the movie image should show", async () => {
      const imageUrl = `https://image.tmdb.org/t/p/w500${mockedMovie.backdrop_path}`;
      await waitFor(() => {
        const image = screen.getByRole("img", { name: mockedMovie.title });
        expect(image).toBeInTheDocument();
        expect(image.getAttribute("src")).toEqual(imageUrl);
      });
    });

    it("WHEN component renders THEN the movie description should show", async () => {
      await waitFor(() => {
        const description = screen.getByText(mockedMovie.overview);
        expect(description).toBeInTheDocument();
      });
    });

    it("WHEN component renders THEN a wishlist button should show", () => {
      const wishlistButton = screen.getByRole("button", {
        name: /add to wishlist/i,
      });
      expect(wishlistButton).toBeInTheDocument();
    });

    it("WHEN clicking the wishlist button THEN the movie should be added to wishlist", async () => {
      const wishlistButton = screen.getByRole("button", {
        name: /add to wishlist/i,
      });
      expect(wishlistButton.getAttribute("color")).toEqual("gray");
      await fireEvent.click(wishlistButton);
      expect(wishlistButton.getAttribute("color")).toEqual("red");
    });

    it("WHEN component renders THEN an additional info area should show", async () => {
      const linkToHomepage = screen.getByRole("link", {
        name: /go to homepage/i,
      });
      expect(linkToHomepage).toBeInTheDocument();

      await waitFor(() => {
        const releaseDate = screen.getByTestId("release-date");
        expect(releaseDate).toEqual(mockedMovie.release_date);
      });
    });

    it("GIVEN a category WHEN component renders THEN the category should show in the additional info area", () => {
      const movieCategory = screen.getByText(moviesDetailsProps.category);
      expect(movieCategory).toBeInTheDocument();
    });

    it("GIVEN the Upcoming movie category WHEN component renders THEN a specific font should show", async () => {
      await waitFor(() => {
        const title = screen.getByText(mockedMovie.title);
        const style = window.getComputedStyle(title);
        expect(style.fontFamily).toMatch(/Impact/i);
      });
    });

    it("GIVEN the Upcoming movie category WHEN component renders THEN the heart icon button should show", () => {
      expect(screen.getByLabelText("heart-icon")).toBeInTheDocument();
    });

    it("GIVEN the Upcoming movie category WHEN component renders THEN a specific background color should show", () => {
      const container = screen.getByTestId("movie-details");
      expect(container).toHaveStyle("background-color: light-pink");
    });
  });

  describe("with Popular as category and initialMovie given", () => {
    const moviesDetailsPropsPopular: MovieDetailsProps = {
      ...moviesDetailsProps,
      category: "Popular",
    };

    beforeEach(() => {
      render(<MovieDetailsPage {...moviesDetailsPropsPopular} />);
    });

    afterEach(() => vi.restoreAllMocks());

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
