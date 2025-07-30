import Loading from "../components/Loading.tsx";
import { render, screen } from "@testing-library/react";

describe("Testing Loading component", () => {
  afterEach(() => vi.restoreAllMocks());

  describe("GIVEN no props by default loading more", () => {
    beforeEach(() => {
      render(<Loading />);
    });

    it("WHEN component renders THEN the loading more component should show", () => {
      const loading = screen.getByTestId("loading-more-component");
      expect(loading).toBeInTheDocument();
    });
  });

  describe("GIVEN props with type loading state", () => {
    const loadingStateProps = {
      type: "loading-state",
      spinnerText: "Loading test state...",
      loadingText: "Loading all the test state",
    };
    beforeEach(() => {
      render(<Loading {...loadingStateProps} />);
    });

    it("WHEN component renders THEN the loading state component should show", () => {
      const loading = screen.getByTestId("loading-state-component");
      expect(loading).toBeInTheDocument();
    });

    it("WHEN component renders THEN the loading spinner text should show", () => {
      const spinnerText = screen.queryByText(loadingStateProps.spinnerText);
      expect(spinnerText).toBeInTheDocument();
    });

    it("WHEN component renders THEN the loading loading text should show", () => {
      const loadingText = screen.queryByText(loadingStateProps.loadingText);
      expect(loadingText).toBeInTheDocument();
    });
  });
});
