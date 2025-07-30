import WishlistPage from "../pages/WishlistPage.tsx";
import { render, screen, fireEvent } from "@testing-library/react";
import { useWishlistMovies } from "../hooks/useWishlistMovies.ts";
import { Movie } from "../types.ts";
import * as functions from '../functions.ts';

vi.mock('../hooks/useAuthentication', () => ({
  useAuthentication: () => ({
    accountId: 'fake-account-id',
    sessionId: 'fake-session-id',
  }),
}));

vi.mock('../functions', () => ({
  handleMovieSelection: vi.fn(),
}));

vi.mock("../hooks/useWishlistMovies", () => ({
  useWishlistMovies: vi.fn()
}));

describe("Testing WishlistPage", () => {
  const wishlist: Movie[] | null = [
    {
      id: 123,
      title: 'Movie One',
      overview: 'Overview 1',
      poster_path: '/poster1.jpg',
      tagline: '',
      backdrop_path: '/backdrop1.jpg',
      release_date: '2023-01-01',
      homepage: 'https://link.to.some.movies.page.com',
      vote_average: 3.456
    },
    {
      id: 234,
      title: 'Movie Two',
      overview: 'Overview 2',
      poster_path: '/poster2.jpg',
      tagline: '',
      backdrop_path: '/backdrop2.jpg',
      release_date: '2023-01-02',
      homepage: '',
      vote_average: 2.876
    },
  ];

  const useWishlist = {
    movies: wishlist,
    loading: false,
    error: null,
    loadMore: vi.fn(),
    hasMore: false,
  };

  describe("with a wishlist", () => {

    beforeEach(() => {
      (useWishlistMovies as any).mockImplementation(() => useWishlist);
      render(<WishlistPage />);
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it("WHEN component renders THEN the Wishlist title should show", () => {
      const title = screen.getByRole('heading', {name: "My Wishlist"});
      expect(title).toBeInTheDocument();
    });

    it("WHEN component renders THEN a list of saved movie wishlist cards should show", () => {
      const movieOne = screen.getByText(wishlist[0].title);
      const movieTwo = screen.getByText(wishlist[1].title);
      expect(movieOne).toBeInTheDocument();
      expect(movieTwo).toBeInTheDocument();
    });

    it("WHEN clicking a whishlisted card THEN should navigate to that card id", () => {
      const wishlistCards = screen.getAllByTestId('movie-card');
      fireEvent.click(wishlistCards[0]);
      expect(functions.handleMovieSelection).toHaveBeenCalledWith(123, 'popular');
    });

    it("GIVEN no error message WHEN component renders THEN no error message should show", () => {
      const errorMessage = screen.queryByText('Error: ');
      expect(errorMessage).not.toBeInTheDocument();
    });
  });

  describe('when error message exists', () => {
    const useWishlistWithError = {
      ...useWishlist,
      error: 'Some test error message',
    };

    it("GIVEN an error message WHEN component renders THEN that error message should show", () => {
      (useWishlistMovies as any).mockImplementation(() => useWishlistWithError);
      render(<WishlistPage />);
      const errorMessage = screen.getByText('Error: ' + useWishlistWithError.error);
      expect(errorMessage).toBeInTheDocument();
    });
  });

  describe('while movie wishlist is loading', () => {
    const useLoadingWishlist = {
      ...useWishlist,
      loading: true,
    };

    it("WHEN component is loading THEN the loading component should show", () => {
      (useWishlistMovies as any).mockImplementation(() => useLoadingWishlist);
      render(<WishlistPage />);
      const loading = screen.getByText('Loading more movies...');
      expect(loading).toBeInTheDocument();
    });
  });

  describe("with an empty wishlist", () => {
    const emptyWishlist: Movie[] | null = [];
    const useWishlistEmptyList = {
      ...useWishlist,
      movies: emptyWishlist,
    };

    beforeEach(() => {
      (useWishlistMovies as any).mockImplementation(() => useWishlistEmptyList);
      render(<WishlistPage />);
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it("GIVEN no movies in the wishlist WHEN component renders THEN no MovieWishlistCards should show", () => {
      const wishlistCard = screen.queryByTestId("movie-card");
      expect(wishlistCard).not.toBeInTheDocument();
    });

    it("GIVEN no movies in the wishlist WHEN component renders THEN a text message should show", () => {
      const message = screen.getByText("Your wishlist is empty");
      expect(message).toBeInTheDocument();
    });
  });
});
