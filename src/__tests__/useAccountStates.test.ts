import { renderHook, act, waitFor } from "@testing-library/react";
import { useAccountStates } from "../hooks/useAccountStates.ts";

global.fetch = vi.fn();

describe("useAccountStates", () => {
  beforeEach(() => {
    (fetch as any).mockReset();
  });

  it("should have initial state", () => {
    const { result } = renderHook(() => useAccountStates());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.success).toBeNull();
    expect(typeof result.current.isMovieInWishlist).toBe("function");
  });

  describe("isMovieInWishlist", () => {
    it("should return false when sessionId is not provided", async () => {
      const { result } = renderHook(() => useAccountStates());

      await act(async () => {
        const isInWishlist = await result.current.isMovieInWishlist({
          movieId: "123",
          sessionId: "",
        });

        expect(isInWishlist).toBe(false);
      });
    });

    it("should return false when sessionId is null", async () => {
      const { result } = renderHook(() => useAccountStates());

      await act(async () => {
        const isInWishlist = await result.current.isMovieInWishlist({
          movieId: "123",
          sessionId: null as any,
        });

        expect(isInWishlist).toBe(false);
      });
    });

    it("should return true when movie is in watchlist", async () => {
      const mockResponse = { watchlist: true };
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const { result } = renderHook(() => useAccountStates());

      await act(async () => {
        const isInWishlist = await result.current.isMovieInWishlist({
          movieId: "123",
          sessionId: "session123",
        });

        expect(isInWishlist).toBe(true);
      });

      expect(fetch).toHaveBeenCalledWith(
        "/api/tmdb/account_states?movieId=123&session_id=session123",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
    });

    it("should return false when movie is not in watchlist", async () => {
      const mockResponse = { watchlist: false };
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const { result } = renderHook(() => useAccountStates());

      await act(async () => {
        const isInWishlist = await result.current.isMovieInWishlist({
          movieId: "456",
          sessionId: "session456",
        });

        expect(isInWishlist).toBe(false);
      });
    });

    it("should return false when watchlist property is undefined", async () => {
      const mockResponse = { otherProperty: "value" };
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const { result } = renderHook(() => useAccountStates());

      await act(async () => {
        const isInWishlist = await result.current.isMovieInWishlist({
          movieId: "789",
          sessionId: "session789",
        });

        expect(isInWishlist).toBe(false);
      });
    });

    it("should handle network error and set error state", async () => {
      const networkError = new Error("Network error");
      (fetch as any).mockRejectedValueOnce(networkError);

      const { result } = renderHook(() => useAccountStates());

      await act(async () => {
        const isInWishlist = await result.current.isMovieInWishlist({
          movieId: "123",
          sessionId: "session123",
        });

        expect(isInWishlist).toBe(false);
      });

      await waitFor(() => {
        expect(result.current.error).toBe("Network error");
        expect(result.current.success).toBe(false);
      });
    });

    it("should handle non-ok response and return false", async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: "Unauthorized",
      });

      const { result } = renderHook(() => useAccountStates());

      await act(async () => {
        const isInWishlist = await result.current.isMovieInWishlist({
          movieId: "123",
          sessionId: "session123",
        });

        expect(isInWishlist).toBe(false);
      });
    });

    it("should handle JSON parsing error", async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error("Invalid JSON");
        },
      });

      const { result } = renderHook(() => useAccountStates());

      await act(async () => {
        const isInWishlist = await result.current.isMovieInWishlist({
          movieId: "123",
          sessionId: "session123",
        });

        expect(isInWishlist).toBe(false);
      });

      await waitFor(() => {
        expect(result.current.error).toBe("Invalid JSON");
        expect(result.current.success).toBe(false);
      });
    });

    it("should set loading state correctly", async () => {
      let resolvePromise: (value: any) => void;
      const promise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      (fetch as any).mockReturnValueOnce(promise);

      const { result } = renderHook(() => useAccountStates());

      act(() => {
        result.current.isMovieInWishlist({
          movieId: "123",
          sessionId: "session123",
        });
      });

      expect(result.current.loading).toBe(true);
      expect(result.current.error).toBeNull();
      expect(result.current.success).toBeNull();

      // Resolve the promise
      resolvePromise!({
        ok: true,
        json: async () => ({ watchlist: false }),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it("should reset error and success states on new request", async () => {
      // First request with error
      const networkError = new Error("Network error");
      (fetch as any).mockRejectedValueOnce(networkError);

      const { result } = renderHook(() => useAccountStates());

      await act(async () => {
        await result.current.isMovieInWishlist({
          movieId: "123",
          sessionId: "session123",
        });
      });

      await waitFor(() => {
        expect(result.current.error).toBe("Network error");
        expect(result.current.success).toBe(false);
      });

      // Second request with success
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ watchlist: true }),
      });

      await act(async () => {
        await result.current.isMovieInWishlist({
          movieId: "456",
          sessionId: "session456",
        });
      });

      await waitFor(() => {
        expect(result.current.error).toBeNull();
        expect(result.current.success).toBeNull();
      });
    });
  });

  describe("error handling", () => {
    it("should handle TypeError from fetch", async () => {
      (fetch as any).mockImplementationOnce(() => {
        throw new TypeError("Failed to fetch");
      });

      const { result } = renderHook(() => useAccountStates());

      await act(async () => {
        const isInWishlist = await result.current.isMovieInWishlist({
          movieId: "123",
          sessionId: "session123",
        });

        expect(isInWishlist).toBe(false);
      });

      await waitFor(() => {
        expect(result.current.error).toBe("Failed to fetch");
        expect(result.current.success).toBe(false);
      });
    });
  });

  describe("API endpoint validation", () => {
    it("should construct correct API URL with parameters", async () => {
      const mockResponse = { watchlist: true };
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const { result } = renderHook(() => useAccountStates());

      await act(async () => {
        await result.current.isMovieInWishlist({
          movieId: "test-movie-id",
          sessionId: "test-session-id",
        });
      });

      expect(fetch).toHaveBeenCalledWith(
        "/api/tmdb/account_states?movieId=test-movie-id&session_id=test-session-id",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
    });

    it("should handle special characters in movieId and sessionId", async () => {
      const mockResponse = { watchlist: false };
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const { result } = renderHook(() => useAccountStates());

      await act(async () => {
        await result.current.isMovieInWishlist({
          movieId: "movie-123_with-special@chars",
          sessionId: "session-456_with-special@chars",
        });
      });

      expect(fetch).toHaveBeenCalledWith(
        "/api/tmdb/account_states?movieId=movie-123_with-special@chars&session_id=session-456_with-special@chars",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
    });
  });
});
