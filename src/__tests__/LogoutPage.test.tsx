import { render, screen, fireEvent, act } from "@testing-library/react";
import LogoutPage from "../pages/LogoutPage.tsx";
// import { useAuthentication } from '../hooks/useAuthentication.ts';

const logoutFunction = vi.fn();
vi.mock("../hooks/useAuthentication.ts", () => ({
  useAuthentication: () => ({
    accountId: 123,
    logout: logoutFunction,
  }),
}));

describe("Testing LogoutPage", () => {
  beforeEach(() => {
    render(<LogoutPage />);
  });
  it("WHEN component renders THEN the logout icon and title should show", () => {
    const cardTitle = screen.getByRole("heading", { level: 2 });
    expect(cardTitle).toHaveTextContent("🔐Log out");
  });

  it("WHEN component renders THEN the button should show", () => {
    const cardTitle = screen.getByText("Logout");
    expect(cardTitle).toBeInTheDocument();
  });

  it("WHEN clicking the logout button THEN the logout function should be called", () => {
    const cardTitle = screen.getByText("Logout");
    act(() => {
      fireEvent.click(cardTitle);
    });
    expect(logoutFunction).toHaveBeenCalled();
  });

  it("GIVEN the logout was successful WHEN having pressed the button THEN the logout success toast should show", () => {
    const cardTitle = screen.getByText("Logout");
    act(() => {
      fireEvent.click(cardTitle);
    });
    const toast = screen.getByText("Logout successful!");
    expect(toast).toBeInTheDocument();
  });
});
