import Card from "../components/Card.tsx";
import { render, screen } from "@testing-library/react";

describe("Testing Card component", () => {
  afterEach(() => vi.restoreAllMocks());

  it("GIVEN icon props WHEN component renders THEN the icon should show", () => {
    const iconProp = "🎭";
    render(<Card icon={iconProp} />);
    const icon = screen.getByText(iconProp);
    expect(icon).toBeInTheDocument();
  });

  it("GIVEN title props WHEN component renders THEN the title should show", () => {
    const titleProp = "Some test title";
    render(<Card title={titleProp} />);
    const title = screen.getByRole("heading", { name: titleProp, level: 2 });
    expect(title).toBeInTheDocument();
  });

  it("GIVEN wrapping children WHEN component renders THEN the children should show", () => {
    const childrenProp = <p>Some test content</p>;    
    render(<Card>{childrenProp}</Card>);
    const children = screen.getByText(/some test content/i)
    expect(children).toBeInTheDocument();
  });
});
