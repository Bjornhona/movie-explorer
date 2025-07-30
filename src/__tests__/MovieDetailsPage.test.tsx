import { render, screen, fireEvent } from "@testing-library/react";
import MovieDetailsPage from "../pages/MovieDetailsPage.tsx";
import { Movie, MovieDetailsProps } from "../types.ts";
import { CATEGORIES } from "../constants.ts";
import { Category } from "../types.ts";

const mockedMovie: Movie = {
  id: 123,
  title: "Movie One",
  overview: "Test description text",
  tagline: "When masters unite a new legacy begins.",
  poster_path: "/test-poster.jpg",
  backdrop_path: "/test-backdrop.jpg",
  release_date: "1974-12-20",
  homepage: "https://link.to.some.movies.page.com",
  vote_average: 3.456,
};

vi.mock("../hooks/useAuthentication", () => ({
  useAuthentication: () => ({
    sessionId: "fake-session-id",
    accountId: "fake-account-id",
    loading: false,
    error: null,
    getRequestToken: vi.fn(),
    redirectToTmdbApproval: vi.fn(),
  }),
}));

vi.mock("../hooks/useMovieById", () => ({
  useMovieById: () => ({
    movieById: mockedMovie,
    loading: false,
    error: null,
  }),
}));

vi.mock("../hooks/useWishlist", () => ({
  useWishlist: () => ({
    addToWishlist: vi.fn(),
    loading: false,
    error: null,
    success: true,
  }),
}));

vi.mock("../hooks/useAccountStates", () => ({
  useAccountStates: () => ({
    isMovieInWishlist: vi.fn(),
    loading: false
  }),
}));

describe("Testing MovieListPage", () => {
  const moviesDetailsProps: MovieDetailsProps = {
    categoryId: "upcoming",
    movieId: "123",
  };

  const infoAreaCategory =
    CATEGORIES.find((c: Category) => c.id === moviesDetailsProps.categoryId) ||
    CATEGORIES[0];

  afterEach(() => vi.restoreAllMocks());

  describe("with Upcoming as category and no initial movie", () => {
    beforeEach(() => {
      render(<MovieDetailsPage {...moviesDetailsProps} />);
    });

    it("WHEN component renders THEN the movie title and tagline should show as a header", () => {
      const movieTitle = screen.getByRole('heading', {name:mockedMovie.title, level: 1});
      const movieTagline = screen.getByText(`"${mockedMovie.tagline}"`);
      expect(movieTitle).toBeInTheDocument();
      expect(movieTagline).toBeInTheDocument();
    });

    it("WHEN component renders THEN the movie image should show", () => {
      const imageUrl = `https://image.tmdb.org/t/p/w500${mockedMovie.poster_path}`;
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
      expect(wishlistIcon).toHaveAttribute("stroke", "white");
      expect(wishlistIcon).toHaveAttribute("fill", "none");

      await fireEvent.click(wishlistButton);
      
      render(<MovieDetailsPage {...moviesDetailsProps} />);

      expect(wishlistIcon).toHaveAttribute("stroke", "none");
      expect(wishlistIcon).toHaveAttribute("fill", "hotpink");
    });

    it("WHEN component renders THEN an additional info area should show", () => {
      const linkToHomepage = screen.getByRole("link", {
        name: /visit homepage/i,
      });
      expect(linkToHomepage).toBeInTheDocument();

      const releaseDateString = new Date(
        mockedMovie.release_date
      ).toLocaleDateString();
      const releaseDateLabel = screen.getByText("Release Date");
      const releaseDateValue = screen.getByText(releaseDateString);

      expect(releaseDateLabel).toBeInTheDocument();
      expect(releaseDateValue).toBeInTheDocument();
    });

    it("GIVEN a category WHEN component renders THEN the category should show in the additional info area", () => {
      const movieCategories = screen.getAllByText(infoAreaCategory.name);
      expect(movieCategories[0]).toBeInTheDocument();
    });

    it("GIVEN the Upcoming movie category WHEN component renders THEN a specific font should show", () => {
      const title = screen.getByRole("heading", {
        name: mockedMovie.title,
        level: 1,
      });
      expect(title).toHaveClass("upcoming");
    });

    it("GIVEN the Upcoming movie category WHEN component renders THEN the heart icon button should show", () => {
      const icons = screen.getAllByLabelText("heart-icon");
      expect(icons[0]).toBeInTheDocument();
      expect(icons[1]).toBeInTheDocument();
      const wrongIcons = screen.queryAllByLabelText("star-icon");
      expect(wrongIcons[0]).toBeFalsy();
    });

    it("GIVEN the Upcoming movie category WHEN component renders THEN a specific background color should show", () => {
      const container = screen.getByTestId("movie-details-content");
      expect(container).toHaveClass("bg-upcoming");
    });
  });

  describe("with Popular as category", () => {
    const moviesDetailsPropsPopular: MovieDetailsProps = {
      ...moviesDetailsProps,
      categoryId: "popular",
    };

    beforeEach(() => {
      render(<MovieDetailsPage {...moviesDetailsPropsPopular} />);
    });

    it("GIVEN the Popular movie category WHEN component renders THEN a specific font should show", () => {
      const title = screen.getByRole("heading", {
        name: mockedMovie.title,
        level: 1,
      });
      expect(title).toHaveClass("popular");
    });

    it("GIVEN the Popular movie category WHEN component renders THEN the star icon button should show", () => {
      const icons = screen.getAllByLabelText("star-icon");
      expect(icons[0]).toBeInTheDocument();
      expect(icons[1]).toBeInTheDocument();
    });
  });
});
