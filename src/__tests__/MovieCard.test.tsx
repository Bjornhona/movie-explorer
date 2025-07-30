import { render, screen, fireEvent } from "@testing-library/react";
import MovieCard from "../components/MovieCard.tsx";
import { Movie } from "../types.ts";

describe("Testing MovieCard Component", () => {
  const movie: Movie = {
    id: 123,
    title: "Test Movie",
    tagline: "Some tagline",
    overview: "",
    poster_path: "/test.jpg",
    backdrop_path: "/test.jpg",
    release_date: "24-12-1975",
    homepage: "https://some-homepage-path.com",
    vote_average: 3.456,
  };

  const handleClick = vi.fn();

  beforeEach(() => {
    render(<MovieCard movie={movie} ref={undefined} onClick={handleClick} />);
  });

  afterEach(() => vi.restoreAllMocks());

  it("WHEN component renders THEN the movie title should show", () => {
    const movieTitle = screen.getByRole("heading", { level: 3 });
    expect(movieTitle).toHaveTextContent(movie.title);
  });

  it("WHEN component renders THEN the movie image should show", () => {
    const movieAltText = screen.getByAltText(movie.title);
    expect(movieAltText).toBeInTheDocument();
    expect(movieAltText).toHaveAttribute(
      "src",
      `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    );
  });

  it("GIVEN a movie id WHEN clicking the card THEN the click function is called with that id", () => {
    const movieCard = screen.getByTestId("movie-card");
    fireEvent.click(movieCard);
    expect(movieCard).toBeInTheDocument();
    expect(handleClick).toHaveBeenCalledWith(123);
  });
});
