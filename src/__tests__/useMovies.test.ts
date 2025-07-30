import { renderHook, act, waitFor } from '@testing-library/react';
import { useMovies } from '../hooks/useMovies.ts';
import { Movie } from '../types.ts';

global.fetch = vi.fn();

describe('useMovies', () => {
  const mockMoviesPage1: Movie[] = [
    {
      id: 1,
      title: 'Movie 1',
      overview: 'Overview 1',
      poster_path: '/poster1.jpg',
      tagline: 'Tagline 1',
      backdrop_path: '/backdrop1.jpg',
      release_date: '2023-01-01',
      homepage: 'https://example.com/1',
      vote_average: 3.456
    },
    {
      id: 2,
      title: 'Movie 2',
      overview: 'Overview 2',
      poster_path: '/poster2.jpg',
      tagline: 'Tagline 2',
      backdrop_path: '/backdrop2.jpg',
      release_date: '2023-01-02',
      homepage: 'https://example.com/2',
      vote_average: 3.456
    },
  ];
  const mockMoviesPage2: Movie[] = [
    {
      id: 2, // duplicate
      title: 'Movie 2',
      overview: 'Overview 2',
      poster_path: '/poster2.jpg',
      tagline: 'Tagline 2',
      backdrop_path: '/backdrop2.jpg',
      release_date: '2023-01-02',
      homepage: 'https://example.com/2',
      vote_average: 3.456
    },
    {
      id: 3,
      title: 'Movie 3',
      overview: 'Overview 3',
      poster_path: '/poster3.jpg',
      tagline: 'Tagline 3',
      backdrop_path: '/backdrop3.jpg',
      release_date: '2023-01-03',
      homepage: 'https://example.com/3',
      vote_average: 3.456
    },
  ];

  beforeEach(() => {
    (fetch as any).mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch and set movies on initial load', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: mockMoviesPage1, page: 1, total_pages: 2, total_results: 3 }),
    });
    const { result } = renderHook(() => useMovies('popular'));
    await waitFor(() => {
      expect(result.current.movies).toEqual(mockMoviesPage1);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.hasMore).toBe(true);
    });
  });

  it('should set error on fetch failure', async () => {
    (fetch as any).mockResolvedValueOnce({ ok: false, json: async () => ({}) });
    const { result } = renderHook(() => useMovies('popular'));
    await waitFor(() => {
      expect(result.current.error).toBe('Failed to fetch movies');
      expect(result.current.movies).toEqual([]);
    });
  });

  it('should append new unique movies and deduplicate on loadMore', async () => {
    // First page
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: mockMoviesPage1, page: 1, total_pages: 2, total_results: 3 }),
    });
    const { result } = renderHook(() => useMovies('popular'));
    await waitFor(() => {
      expect(result.current.movies).toEqual(mockMoviesPage1);
    });
    // Second page (with duplicate id:2)
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: mockMoviesPage2, page: 2, total_pages: 2, total_results: 3 }),
    });
    await act(async () => {
      result.current.loadMore();
    });
    await waitFor(() => {
      expect(result.current.movies).toEqual([
        mockMoviesPage1[0],
        mockMoviesPage1[1],
        mockMoviesPage2[1], // Only id:3 is new
      ]);
      expect(result.current.hasMore).toBe(false);
    });
  });
});
