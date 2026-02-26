'use client';

import { useState, useEffect, useCallback } from 'react';
import { Point } from '@/types/point';

export function usePoints(citySlug: string) {
  const [points, setPoints] = useState<Point[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPoints = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/points?city=${citySlug}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch points');
      }

      const data = await response.json();
      setPoints(data.points || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error fetching points:', err);
    } finally {
      setLoading(false);
    }
  }, [citySlug]);

  // Fetch on mount
  useEffect(() => {
    fetchPoints();
  }, [fetchPoints]);

  // Refetch function
  const refetch = useCallback(() => {
    fetchPoints();
  }, [fetchPoints]);

  return {
    points,
    loading,
    error,
    refetch,
  };
}
