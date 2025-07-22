import { useState, useEffect } from "react";

interface SessionData {
  success: boolean;
  session_id: string;
  expires_at: string;
}

// interface GuestSessionData {
//   success: boolean;
//   guest_session_id: string;
//   expires_at: string;
// }

interface RequestTokenData {
  success: boolean;
  request_token: string;
  expires_at: string;
}

interface SessionTypes {
  success: boolean;
  session_id: string;
  expires_at: string;
}

const SESSION_STORAGE_KEY = 'tmdb_session';
const REQUEST_TOKEN_STORAGE_KEY = "tmdb_request_token";

export const useAuthentication = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [hasToken, setHasToken] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

    const isSessionExpired = (expiresAt: string): boolean => {
      const expiryDate = new Date(expiresAt);
      const now = new Date();
      return now >= expiryDate;
    };

  // const isTokenExpired = (expiresAt: string): boolean => {
  //   const expiryDate = new Date(expiresAt);
  //   const now = new Date();
  //   return now >= expiryDate;
  // };

    const getStoredRequestToken = (): string | null => {
      try {
        const stored = localStorage.getItem(REQUEST_TOKEN_STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
      } catch {
        return null;
      }
    };

  const getStoredSession = (): SessionData | null => {
    try {
      const stored = localStorage.getItem(SESSION_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };

    const storeRequestToken = (data: string) => {
      try {
        localStorage.setItem(REQUEST_TOKEN_STORAGE_KEY, JSON.stringify(data));
      } catch (error) {
        console.error('Failed to store request token:', error);
      }
    };

  const storeSession = (data: SessionData) => {
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Failed to store session:", error);
    }
  };

  const doRequestToken = async (): Promise<string | null> => {
    try {
      const res = await fetch("/api/tmdb/authentication/token/new");
      const data = await res.json();
      storeRequestToken(data.request_token);
      return data.request_token;
    } catch (err) {
      console.error("Failed to get request token", err);
      return null;
    }
  };

  // const doRequestToken = async (): Promise<RequestTokenData | null> => {
  //   try {
  //     setLoading(true);
  //     setError(null);

  //     // Check if we already have a valid request token
  //     const storedSession = getStoredRequestToken();
  //     if (storedSession && storedSession.success && !isTokenExpired(storedSession.expires_at)) {
  //       console.log('Using existing request token:', storedSession.request_token);
  //       setHasToken(true);
  //       setRequestToken(storedSession.request_token);
  //       setLoading(false);
  //       // return true;
  //       return storedSession;
  //     }

  //     // Create new request token
  //     console.log('Creating new request token...');
  //     const response = await fetch('/api/tmdb/authentication/token/new');
  //     if (!response.ok) {
  //       throw new Error('Failed to get request token');
  //     }
  //     const data: RequestTokenData = await response.json();
  //     console.log('Request token response:', data);

  //     if (data.success) {
  //       storeRequestToken(data);
  //       setHasToken(true);
  //       setRequestToken(data.request_token);
  //       // return true;
  //       return data;
  //     } else {
  //       setHasToken(false);
  //       setError('Failed to get request token');
  //       // return false;
  //       return null;
  //     }
  //   } catch (err) {
  //     const errorMessage = err instanceof Error ? err.message : 'Unknown error';
  //     setError(errorMessage);
  //     setHasToken(false);
  //     console.error('Getting request token failed:', err);
  //     // return false;
  //     return null;
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  const createSession = async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const requestToken = getStoredRequestToken();

      // Check if we already have a valid stored session
      const storedSession = getStoredSession();
      if (storedSession && storedSession.success && !isSessionExpired(storedSession.expires_at)) {
        console.log('Using existing sessionId:', storedSession.session_id);
        setIsAuthenticated(true);
        setSessionId(storedSession.session_id);
        setLoading(false);
        return true;
      }

      // Create new session
      console.log("Creating new session...");
      const response = await fetch("/api/tmdb/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ request_token: requestToken }),
      });

      // const response = await fetch("/api/tmdb/session");
      if (!response.ok) {
        throw new Error("Failed to create session");
      }

      const data: SessionData = await response.json();
      console.log("Session response:", data);

      if (data.success) {
        storeSession(data);
        setIsAuthenticated(true);
        setSessionId(data.session_id);
        return true;
      } else {
        setIsAuthenticated(false);
        setError("Failed to create session");
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      setIsAuthenticated(false);
      console.error("Session error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  //   const doAuthentication = async (): Promise<boolean> => {
  //     try {
  //       setLoading(true);
  //       setError(null);

  //       // Check if we already have a valid stored guest session
  //       const storedSession = getStoredGuestSession();
  //       if (storedSession && storedSession.success && !isSessionExpired(storedSession.expires_at)) {
  //         console.log('Using existing guest session:', storedSession.guest_session_id);
  //         setIsAuthenticated(true);
  //         setGuestSessionId(storedSession.guest_session_id);
  //         setLoading(false);
  //         return true;
  //       }

  //       // Create new guest session
  //       console.log('Creating new guest session...');
  //       const response = await fetch('/api/tmdb/guest-session');
  //       if (!response.ok) {
  //         throw new Error('Failed to create guest session');
  //       }

  //       const data: GuestSessionData = await response.json();
  //       console.log('Guest session response:', data);

  //       if (data.success) {
  //         storeGuestSession(data);
  //         setIsAuthenticated(true);
  //         setGuestSessionId(data.guest_session_id);
  //         return true;
  //       } else {
  //         setIsAuthenticated(false);
  //         setError('Failed to create guest session');
  //         return false;
  //       }
  //     } catch (err) {
  //       const errorMessage = err instanceof Error ? err.message : 'Unknown error';
  //       setError(errorMessage);
  //       setIsAuthenticated(false);
  //       console.error('Guest session error:', err);
  //       return false;
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   // Run authentication on component mount
  //   useEffect(() => {
  //     // doAuthentication();
  //     doRequestToken();
  //   }, []);

  //   const clearGuestSession = () => {
  //     try {
  //       localStorage.removeItem(GUEST_SESSION_STORAGE_KEY);
  //       setIsAuthenticated(false);
  //       setGuestSessionId(null);
  //     } catch (error) {
  //       console.error('Failed to clear guest session:', error);
  //     }
  //   };
  const clearSession = () => {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      // setIsAuthenticated(false);
      // setSessionId(null);
    } catch (error) {
      console.error('Failed to clear guest session:', error);
    }
  };

  //   const refreshGuestSession = () => {
  //     clearGuestSession();
  //     return doAuthentication();
  //   };
  const refreshSession = () => {
    clearSession();
    return doRequestToken();
  };

  return {
    //     isAuthenticated,
    //     hasToken,
    //     loading,
    //     error,
    //     guestSessionId,
    getStoredSession,
    //     doAuthentication,
    doRequestToken,
    //     clearGuestSession,
    refreshSession,
    createSession,
    getStoredRequestToken
  };
};
