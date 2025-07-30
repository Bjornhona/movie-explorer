import { render, screen } from '@testing-library/react';
import Toast from '../components/Toast.tsx';
import { vi } from 'vitest';

describe('Testing Toast component', () => {
  it('WHEN component renders THEN the message and default color should show', () => {
    render(<Toast message="Hello World!" />);
    const toast = screen.getByLabelText('toast-message');
    expect(toast).toBeInTheDocument();
    expect(toast).toHaveTextContent('Hello World!');
    expect(toast).toHaveClass('green');
  });

  it('GIVEN props color red WHEN component renders THEN the toast should show with red color', () => {
    render(<Toast message="Error!" color="red" />);
    const toast = screen.getByLabelText('toast-message');
    expect(toast).toHaveClass('red');
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
