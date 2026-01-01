import { useState, useEffect, useCallback } from 'react';
import { GlancesData } from '../types/glances';
import { glancesApi } from '../services/glancesApi';

export const useGlancesData = (refreshInterval: number = 2000) => {
  const [data, setData] = useState<GlancesData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const stats = await glancesApi.getAllStats();

      if (stats && typeof stats === 'object') {
        setData(stats);
        setError(null);
        setIsConnected(true);
      } else {
        throw new Error('Invalid data received from Glances API');
      }

      setIsLoading(false);
    } catch (err) {
      console.error('Glances API Error:', err);

      let errorMessage = 'Failed to connect to Glances';

      if (err instanceof TypeError && err.message.includes('fetch')) {
        errorMessage = 'Cannot connect to Glances server. Please ensure Glances is running on localhost:61208';
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      setIsLoading(false);
      setIsConnected(false);

      // Keep previous data if available (for intermittent connection issues)
      // setData(null); - commented out to keep last known good data
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchData, refreshInterval]);

  return { data, error, isLoading, isConnected, refetch: fetchData };
};
