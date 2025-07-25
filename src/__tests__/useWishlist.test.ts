import { renderHook, act, waitFor } from '@testing-library/react';
import { useWishlist } from '../hooks/useWishlist.ts';

global.fetch = vi.fn();

describe('useWishlist', () => {
  beforeEach(() => {
    (fetch as any).mockReset();
  });

  it('should set loading true while adding and false after', async () => {
    (fetch as any).mockResolvedValueOnce({ ok: true });
    const { result } = renderHook(() => useWishlist());
    act(() => {
      result.current.addToWishlist({ accountId: 'a', sessionId: 's', movieId: 'm' });
    });
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  it('should set success true on successful add', async () => {
    (fetch as any).mockResolvedValueOnce({ ok: true });
    const { result } = renderHook(() => useWishlist());
    await act(async () => {
      await result.current.addToWishlist({ accountId: 'a', sessionId: 's', movieId: 'm' });
    });
    expect(result.current.success).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('should set error and success false on failed add', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'API error' })
    });
    const { result } = renderHook(() => useWishlist());
    await act(async () => {
      await result.current.addToWishlist({ accountId: 'a', sessionId: 's', movieId: 'm' });
    });
    expect(result.current.success).toBe(false);
    expect(result.current.error).toBe('API error');
  });

  it('should set error and success false on fetch exception', async () => {
    (fetch as any).mockImplementationOnce(() => { throw new Error('Network error'); });
    const { result } = renderHook(() => useWishlist());
    await act(async () => {
      await result.current.addToWishlist({ accountId: 'a', sessionId: 's', movieId: 'm' });
    });
    expect(result.current.success).toBe(false);
    expect(result.current.error).toBe('Network error');
  });
});
