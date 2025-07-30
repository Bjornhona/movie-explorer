import NavBar from "../components/NavBar.tsx";
import { render, screen, fireEvent } from "@testing-library/react";
import { NAVIGATION_LINKS } from "../constants.ts";

describe('Testing NavBar component', () => {
  beforeEach(() => {
    render(<NavBar />);
  });

  afterEach(() => vi.restoreAllMocks());

  it('WHEN component renders THEN a navbar should show', () => {
    const nav = screen.getByRole("navigation");
    expect(nav).toBeInTheDocument();
  });

  it('WHEN component renders THEN a list of links should show', () => {
    expect(screen.getByText("Movies")).toBeInTheDocument();
    expect(screen.getByText("My Wishlist")).toBeInTheDocument();
  });

  it('GIVEN a Movies route WHEN clicking on the link THEN should redirect to home page', () => {
    const moviesLink = screen.getByText("Movies");
    fireEvent.click(moviesLink);
    expect(window.location.pathname).toBe("/");    
  });

    it('GIVEN a Wishlist route WHEN clicking on the link THEN should redirect to Wishlist page', () => {
    const wishlistLink = screen.getByText("My Wishlist");
    fireEvent.click(wishlistLink);
    expect(window.location.pathname).toBe("/wishlist");    
  });
});