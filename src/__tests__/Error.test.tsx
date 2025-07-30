import Error from "../components/Error.tsx";
import { fireEvent, render, screen, act } from "@testing-library/react";

describe("Testing Error component", () => {
  afterEach(() => vi.restoreAllMocks());

  it("GIVEN icon props WHEN component renders THEN the icon should show", () => {
    const iconProp = "🎭";
    render(<Error icon={iconProp} />);
    const icon = screen.getByText(iconProp);
    expect(icon).toBeInTheDocument();
  });

  it("GIVEN title and icon props WHEN component renders THEN the icon and title should show", () => {
    const titleProp = "Some test title";
    const iconProp = "🎭";
    render(<Error icon={iconProp} title={titleProp} />);
    const title = screen.getByRole("heading", { name: iconProp + ' ' + titleProp, level: 2 });
    expect(title).toBeInTheDocument();
  });

  it("GIVEN buttonText props WHEN component renders THEN the button should not show", () => {
    const buttonTextProp = "Some test button text";
    render(<Error buttonText={buttonTextProp} />);
    const errorDescription = screen.queryByText(buttonTextProp);
    expect(errorDescription).not.toBeInTheDocument();
  });

  it("GIVEN buttonText and onClick props WHEN component renders THEN the button should show", () => {
    const buttonTextProp = "Some test button text";
    render(<Error buttonText={buttonTextProp} buttonOnClick={() => vi.fn()} />);
    const errorDescription = screen.queryByText(buttonTextProp);
    expect(errorDescription).toBeInTheDocument();
  });

  it("GIVEN onClick props WHEN clicking on the button THEN the buttonOnClick should be called", () => {
    const buttonOnClickMock = vi.fn();
    render(<Error buttonOnClick={buttonOnClickMock} />);
    const button = screen.getByText("OK");

    act(() => fireEvent.click(button));

    expect(buttonOnClickMock).toHaveBeenCalled();
  });
});
