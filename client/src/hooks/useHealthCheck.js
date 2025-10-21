import { useEffect, useRef } from 'react';
import { API_ENDPOINTS } from '../config/api';

/**
 * Custom hook to ping the backend health endpoint every 5 seconds
 * This keeps the server connection alive and monitors backend status
 */
export const useHealthCheck = (enabled = true) => {
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const pingHealth = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.HEALTH, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Health check:', data.status, '| Uptime:', Math.floor(data.uptime), 's');
        } else {
          console.warn('Health check failed:', response.status);
        }
      } catch (error) {
        console.error('Health check error:', error.message);
      }
    };

    // Ping immediately on mount
    pingHealth();

    // Then ping every 15 seconds (15000ms)
    intervalRef.current = setInterval(pingHealth, 15000);

    // Cleanup interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        console.log('Health check stopped');
      }
    };
  }, [enabled]);

  return null;
};
