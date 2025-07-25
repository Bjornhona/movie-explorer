import { useState, useEffect } from "react";
import { REQUEST_TOKEN_KEY, SESSION_ID_KEY, ACCOUNT_ID_KEY } from "../constants.ts";

export const useAuthentication = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if any previous sessionId or AccountId
  useEffect(() => {
    const getStoredSessionId = () => localStorage.getItem(SESSION_ID_KEY);
    const storedSessionId = getStoredSessionId();
    storedSessionId && setSessionId(storedSessionId);
  }, []);

  useEffect(() => {
    const getStoredAccountId = () => localStorage.getItem(ACCOUNT_ID_KEY);
    const storedAccountId = getStoredAccountId();
    storedAccountId && setAccountId(storedAccountId);
  }, []);

  // Step 1: Get request token
  const getRequestToken = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/tmdb/authentication/token/new");
      const data = await res.json();
      if (data.success && data.request_token) {
        localStorage.setItem(REQUEST_TOKEN_KEY, data.request_token);
        return data.request_token;
      } else {
        throw new Error("Failed to get request token");
      }
    } catch (err) {
      setError((err as Error).message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Redirect user to TMDB approval page
  const redirectToTmdbApproval = (requestToken: string, redirectUrl: string) => {
    window.location.href = `https://www.themoviedb.org/authenticate/${requestToken}?redirect_to=${encodeURIComponent(redirectUrl)}`;
  };

  // Step 3: Exchange request token for session ID
  const createSession = async (requestToken: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/tmdb/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request_token: requestToken }),
      });
      const data = await res.json();
      if (data.success && data.session_id) {
        setSessionId(data.session_id);
        localStorage.setItem(SESSION_ID_KEY, data.session_id);
        return data.session_id;
      } else {
        throw new Error("Failed to create session");
      }
    } catch (err) {
      setError((err as Error).message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Step 4: Get account ID
  const fetchAccountId = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/tmdb/account");
      const data = await res.json();
      if (data.id) {
        setAccountId(data.id);
        localStorage.setItem(ACCOUNT_ID_KEY, data.id);
        return data.id;
      } else {
        throw new Error("Failed to get account ID");
      }
    } catch (err) {
      setError((err as Error).message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Step 5: Handle redirect back from TMDB
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const approved = urlParams.get("approved");
    const requestToken = urlParams.get("request_token") || localStorage.getItem(REQUEST_TOKEN_KEY);

    if (approved === "true" && requestToken && !sessionId) {
      (async () => {
        const newSessionId = await createSession(requestToken);
        if (newSessionId) {
          await fetchAccountId();
        }
      })();
    }
  }, []);

  // Step 6: Logout/clear
  const logout = () => {
    setSessionId(null);
    setAccountId(null);
    localStorage.removeItem(SESSION_ID_KEY);
    localStorage.removeItem(ACCOUNT_ID_KEY);
    localStorage.removeItem(REQUEST_TOKEN_KEY);
  };

  return {
    sessionId,
    accountId,
    loading,
    error,
    getRequestToken,
    redirectToTmdbApproval,
    logout,
    createSession,
    fetchAccountId,
  };
};
