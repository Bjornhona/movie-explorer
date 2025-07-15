import { render, screen, fireEvent } from '@testing-library/react';
import MovieDetailsPage from '../components/MovieDetailsPage.tsx';
import { describe, it, vi, expect } from 'vitest';
import { MovieDetailsProps } from '../types.ts';

describe('Testing MovieListPage', () => {
  const moviesDetailsProps: MovieDetailsProps = {
    category: 'upcoming',
    movieId: 'movie-123'
  }

  let systemUnderTest;
  beforeEach(() => {
    systemUnderTest = render(<MovieDetailsPage {...moviesDetailsProps} />);
  });

  afterEach(() => vi.restoreAllMocks());

  it('WHEN component renders THEN the movie title should show as a header', () => {
    const movieTitle = screen.getByText(moviesDetailsProps.movieId);
    expect(movieTitle).toBeInTheDocument();
  });

  it('WHEN component renders THEN the movie image should show', () => {
    // const image = screen.getByRole('img', { name:  movie.title});
    // expect(image).toBeInTheDocument();
  });

  it('WHEN component renders THEN the movie description should show', () => {
    // expect(screen.getByText('Upcoming')).toBeInTheDocument();
  });

  it('WHEN component renders THEN a wishlist button should show', () => {
    // expect(screen.getByText('Upcoming')).toBeInTheDocument();
  });

  it('WHEN clicking the wishlist button THEN the movie should be added to wishlist', () => {
    // expect(screen.getByText('Upcoming')).toBeInTheDocument();
  });

  it('WHEN component renders THEN an additional info area should show', () => {
    // expect(screen.getByText('Upcoming')).toBeInTheDocument();
  });

  it('GIVEN a category WHEN component renders THEN a specific font should show', () => {
    // expect(screen.getByText('Upcoming')).toBeInTheDocument();
  });

  it('GIVEN a category WHEN component renders THEN a specific button should show', () => {
    // expect(screen.getByText('Upcoming')).toBeInTheDocument();
  });
});
