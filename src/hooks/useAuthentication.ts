import { useState, useEffect } from 'react';

interface GuestSessionData {
  success: boolean;
  guest_session_id: string;
  expires_at: string;
}

const GUEST_SESSION_STORAGE_KEY = 'tmdb_guest_session';

export const useAuthentication = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [guestSessionId, setGuestSessionId] = useState<string | null>(null);

  const isSessionExpired = (expiresAt: string): boolean => {
    const expiryDate = new Date(expiresAt);
    const now = new Date();
    return now >= expiryDate;
  };

  const getStoredGuestSession = (): GuestSessionData | null => {
    try {
      const stored = localStorage.getItem(GUEST_SESSION_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };

  const storeGuestSession = (data: GuestSessionData) => {
    try {
      localStorage.setItem(GUEST_SESSION_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to store guest session:', error);
    }
  };

  const doAuthentication = async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // Check if we already have a valid stored guest session
      const storedSession = getStoredGuestSession();
      if (storedSession && storedSession.success && !isSessionExpired(storedSession.expires_at)) {
        console.log('Using existing guest session:', storedSession.guest_session_id);
        setIsAuthenticated(true);
        setGuestSessionId(storedSession.guest_session_id);
        setLoading(false);
        return true;
      }

      // Create new guest session
      console.log('Creating new guest session...');
      const response = await fetch('/api/tmdb/guest-session');
      if (!response.ok) {
        throw new Error('Failed to create guest session');
      }

      const data: GuestSessionData = await response.json();
      console.log('Guest session response:', data);

      if (data.success) {
        storeGuestSession(data);
        setIsAuthenticated(true);
        setGuestSessionId(data.guest_session_id);
        return true;
      } else {
        setIsAuthenticated(false);
        setError('Failed to create guest session');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setIsAuthenticated(false);
      console.error('Guest session error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Run authentication on component mount
  useEffect(() => {
    doAuthentication();
  }, []);

  const clearGuestSession = () => {
    try {
      localStorage.removeItem(GUEST_SESSION_STORAGE_KEY);
      setIsAuthenticated(false);
      setGuestSessionId(null);
    } catch (error) {
      console.error('Failed to clear guest session:', error);
    }
  };

  const refreshGuestSession = () => {
    clearGuestSession();
    return doAuthentication();
  };

  return {
    isAuthenticated,
    loading,
    error,
    guestSessionId,
    doAuthentication,
    clearGuestSession,
    refreshGuestSession,
  };
}; 