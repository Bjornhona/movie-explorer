import { renderHook, act, waitFor } from '@testing-library/react';
import { useMovieById } from '../hooks/useMovieById.ts';
import { Movie } from '../types.ts';

global.fetch = vi.fn();

describe('useMovieById', () => {
  const mockMovie: Movie = {
    id: 123,
    title: 'Test Movie',
    overview: 'A test movie',
    poster_path: '/poster.jpg',
    tagline: 'Test tagline',
    backdrop_path: '/backdrop.jpg',
    release_date: '2023-01-01',
    homepage: 'https://example.com',
    vote_average: 3.246
  };

  beforeEach(() => {
    (fetch as any).mockReset();
  });

  it('should set loading true while fetching and false after', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockMovie,
    });
    const { result } = renderHook(() => useMovieById('123'));
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  it('should set movieById on success', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockMovie,
    });
    const { result } = renderHook(() => useMovieById('123'));
    await waitFor(() => {
      expect(result.current.movieById).toEqual(mockMovie);
      expect(result.current.error).toBeNull();
    });
  });

  it('should set error on fetch failure', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => ({})
    });
    const { result } = renderHook(() => useMovieById('123'));
    await waitFor(() => {
      expect(result.current.movieById).toBeNull();
      expect(result.current.error).toBe('Failed to fetch movie details');
    });
  });
});
