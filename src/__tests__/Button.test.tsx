import Button from "../components/Button.tsx";
import { render, screen } from "@testing-library/react";

describe("Testing Button component", () => {

  afterEach(() => vi.restoreAllMocks());

  it('GIVEN onClick function WHEN component renders THEN the button should show', () => {
    render(<Button onClick={vi.fn()} />);
    const button = screen.getByText('OK');

    expect(button).toBeInTheDocument();
  });

    it('GIVEN onClick and text props WHEN component renders THEN the button text should show', () => {
    const buttonText = 'Button test text';
    render(<Button onClick={vi.fn()} text={buttonText} />);
    const button = screen.getByText(buttonText);

    expect(button).toBeInTheDocument();
  });
});
