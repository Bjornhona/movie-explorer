import NotFoundPage from "../components/NotFoundPage.tsx";
import { render, screen } from "@testing-library/react";

describe('Testing NotFoundPage', () => {
  it('WHEN component renders THEN the message should show', () => {
    render(<NotFoundPage />);
    expect(screen.getByText('404 - Page Not Found')).toBeInTheDocument();
  });
});
