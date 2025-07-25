import { render, screen } from '@testing-library/react';
import Toast from '../components/Toast.tsx';
import { vi } from 'vitest';

describe('Testing Toast component', () => {
  it('WHEN component renders THEN the message and default color should show', () => {
    render(<Toast message="Hello World!" />);
    const toast = screen.getByLabelText('toast-message');
    expect(toast).toBeInTheDocument();
    expect(toast).toHaveTextContent('Hello World!');
    expect(toast).toHaveStyle('color: rgb(0, 128, 0)');
  });

  it('WHEN component renders THEN the toast should show with a custom color', () => {
    render(<Toast message="Error!" color="rgb(255, 0, 0)" />);
    const toast = screen.getByLabelText('toast-message');
    expect(toast).toHaveStyle('color: rgb(255, 0, 0)');
  });

  it('GIVEN a timeout duration WHEN timeout ends THEN should call onClose function', () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    render(<Toast message="Bye!" duration={1000} onClose={onClose} />);
    expect(onClose).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1000);
    expect(onClose).toHaveBeenCalled();
    vi.useRealTimers();
  });
});
