'use client';

import dynamic from 'next/dynamic';
import { Point } from '@/types/point';
import { City } from '@/types/city';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

// Dynamic import to avoid SSR issues with Leaflet
const LeafletMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600 font-medium">Carregando mapa...</p>
      </div>
    </div>
  ),
});

export interface MapViewProps {
  city: City;
  points: Point[];
  onPointClick?: (point: Point) => void;
  onMapClick?: (lat: number, lng: number) => void;
  mapPickerMode?: boolean;
  selectedLocation?: { lat: number; lng: number } | null;
}

export function MapView({
  city,
  points,
  onPointClick,
  onMapClick,
  mapPickerMode = false,
  selectedLocation,
}: MapViewProps) {
  return (
    <div className="relative h-full w-full">
      <LeafletMap
        center={city.coordinates}
        bounds={city.bounds}
        points={points}
        onPointClick={onPointClick}
        onMapClick={onMapClick}
        mapPickerMode={mapPickerMode}
        selectedLocation={selectedLocation}
      />
    </div>
  );
}
