import { render, screen, fireEvent } from "@testing-library/react";
import MovieCard from "../components/MovieCard.tsx";
import { describe, it, vi, expect } from "vitest";

describe("Testing MovieCard Component", () => {
  const movie = {
    id: 123,
    title: "Test Movie",
    overview: "",
    poster_path: "/test.jpg",
  };

  const handleClick = vi.fn();

  let systemUderTest;
  beforeEach(() => {
    systemUderTest = render(
      <MovieCard movie={movie} ref={undefined} onClick={handleClick} />
    );
  });

  afterEach(() => vi.restoreAllMocks());

  it("WHEN component renders THEN the movie title and image show", () => {
    expect(screen.getByAltText("Test Movie")).toBeInTheDocument();
    expect(screen.getByAltText("Test Movie")).toHaveAttribute(
      "src",
      "https://image.tmdb.org/t/p/w500/test.jpg"
    );
  });

  it("GIVEN a movie id WHEN clicking the card THEN the click function is called with that id", () => {
    const movieCard = screen.getByTestId("movie-card");
    fireEvent.click(movieCard);
    expect(movieCard).toBeInTheDocument();
    expect(handleClick).toHaveBeenCalledWith(123);
  });
});
