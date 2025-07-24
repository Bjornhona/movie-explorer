import Loading from "../components/Loading.tsx";
import { render, screen } from "@testing-library/react";

describe("Testing Loading component", () => {
  beforeEach(() => {
    render(<Loading />);
  });

  afterEach(() => vi.restoreAllMocks());

  it("WHEN component renders THEN the loading component should show", () => {
    const loading = screen.getByTestId("loading-component");
    expect(loading).toBeInTheDocument();
  });
});
