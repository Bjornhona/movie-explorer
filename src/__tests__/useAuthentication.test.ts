import { renderHook, act, waitFor } from "@testing-library/react";
import { useAuthentication } from "../hooks/useAuthentication.ts";
import {
  REQUEST_TOKEN_KEY,
  SESSION_ID_KEY,
  ACCOUNT_ID_KEY,
} from "../constants.ts";

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

global.fetch = vi.fn();

describe("useAuthentication", () => {
  beforeEach(() => {
    localStorage.clear();
    (fetch as any).mockReset();
  });

  it("should have initial state", () => {
    const { result } = renderHook(() => useAuthentication());
    expect(result.current.sessionId).toBeNull();
    expect(result.current.accountId).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("getRequestToken sets token in localStorage on success", async () => {
    (fetch as any).mockResolvedValueOnce({
      json: async () => ({ success: true, request_token: "abc123" }),
    });
    const { result } = renderHook(() => useAuthentication());
    await act(async () => {
      const token = await result.current.getRequestToken();
      expect(token).toBe("abc123");
      expect(localStorage.getItem(REQUEST_TOKEN_KEY)).toBe("abc123");
    });
  });

  it("createSession sets sessionId in state and localStorage on success", async () => {
    (fetch as any).mockResolvedValueOnce({
      json: async () => ({ success: true, session_id: "sess456" }),
    });
    const { result } = renderHook(() => useAuthentication());
    await act(async () => {
      const sessionId = await result.current.createSession("reqtoken");
      expect(sessionId).toBe("sess456");
      expect(localStorage.getItem(SESSION_ID_KEY)).toBe("sess456");
    });
    await waitFor(() => {
      expect(result.current.sessionId).toBe("sess456");
    });
  });

  it("fetchAccountId sets accountId in state and localStorage on success", async () => {
    (fetch as any).mockResolvedValueOnce({
      json: async () => ({ id: "acc789" }),
    });
    const { result } = renderHook(() => useAuthentication());
    await act(async () => {
      const accountId = await result.current.fetchAccountId();
      expect(accountId).toBe("acc789");
      expect(localStorage.getItem(ACCOUNT_ID_KEY)).toBe("acc789");
    });
    await waitFor(() => {
      expect(result.current.accountId).toBe("acc789");
    });
  });

  it("logout clears sessionId and accountId from state and localStorage", () => {
    localStorage.setItem(SESSION_ID_KEY, "sess456");
    localStorage.setItem(ACCOUNT_ID_KEY, "acc789");
    const { result } = renderHook(() => useAuthentication());
    act(() => {
      result.current.logout();
    });
    expect(result.current.sessionId).toBeNull();
    expect(result.current.accountId).toBeNull();
    expect(localStorage.getItem(SESSION_ID_KEY)).toBeNull();
    expect(localStorage.getItem(ACCOUNT_ID_KEY)).toBeNull();
  });
});
