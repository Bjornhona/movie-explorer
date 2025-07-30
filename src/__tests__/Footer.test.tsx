import Footer from "../components/Footer.tsx";
import { fireEvent, render, screen, act } from "@testing-library/react";

describe("Testing Footer component", () => {
  afterEach(() => vi.restoreAllMocks());

  it("WHEN component renders THEN the Footer should show", () => {
    render(<Footer />);
    const brandName = screen.getByText("MovieExplorer");
    const brandTagline = screen.getByText("Discover your next favorite movie");
    expect(brandName).toBeInTheDocument();
    expect(brandTagline).toBeInTheDocument();
  });
});
