'use client';

import { useState } from 'react';

export interface GeocodingResult {
  lat: number;
  lng: number;
  displayName: string;
}

export function useGeocoding() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const geocode = async (address: string, citySlug: string): Promise<GeocodingResult | null> => {
    if (!address || address.length < 10) {
      setError('Endereço muito curto');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/geocode?${new URLSearchParams({ address, city: citySlug })}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao buscar localização');
      }

      const data = await response.json();

      return {
        lat: data.result.lat,
        lng: data.result.lng,
        displayName: data.result.displayName,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    geocode,
    loading,
    error,
  };
}
