import { render, screen, fireEvent } from '@testing-library/react';
import MoviesListPage from '../pages/MoviesListPage.tsx';
// import { describe, it, vi, expect } from 'vitest';

describe('Testing MovieListPage', () => {
  let systemUnderTest;
  beforeEach(() => {
    systemUnderTest = render(<MoviesListPage />);
  });

  afterEach(() => vi.restoreAllMocks());

  it('WHEN component renders THEN the page title should show', () => {
    expect(screen.getByText('Movies')).toBeInTheDocument();
  });

  it('WHEN component renders THEN all three movie carousels should show', () => {
    expect(screen.getByTestId('carousel-upcoming')).toBeInTheDocument();
    expect(screen.getByTestId('carousel-popular')).toBeInTheDocument();
    expect(screen.getByTestId('carousel-top_rated')).toBeInTheDocument();
  });

  it('WHEN component renders THEN the movie carousels should show the correct titles', () => {
    expect(screen.getByText('Upcoming')).toBeInTheDocument();
    expect(screen.getByText('Popular')).toBeInTheDocument();
    expect(screen.getByText('Top Rated')).toBeInTheDocument();
  });
});
