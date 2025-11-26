import { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';

export const useTokenRefresh = () => {
  const { refreshToken, isAuthenticated } = useAuth();
  const refreshIntervalRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) {
      // Set up automatic token refresh every 5 minutes
      refreshIntervalRef.current = setInterval(async () => {
        try {
          await refreshToken();
        } catch (error) {
          console.warn('Automatic token refresh failed:', error);
        }
      }, 5 * 60 * 1000); // 5 minutes
    } else {
      // Clear interval if user is not authenticated
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    }

    // Cleanup on unmount
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [isAuthenticated, refreshToken]);

  return {
    refreshToken,
  };
};
