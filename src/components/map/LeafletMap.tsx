'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Point } from '@/types/point';
import { CityBounds, CityCoordinates } from '@/types/city';

// Fix for default marker icons in Leaflet with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export interface LeafletMapProps {
  center: CityCoordinates;
  bounds?: CityBounds;
  points: Point[];
  onPointClick?: (point: Point) => void;
  onMapClick?: (lat: number, lng: number) => void;
  mapPickerMode?: boolean;
  selectedLocation?: { lat: number; lng: number } | null;
}

export default function LeafletMap({
  center,
  bounds,
  points,
  onPointClick,
  onMapClick,
  mapPickerMode = false,
  selectedLocation,
}: LeafletMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const mapPickerMarkerRef = useRef<L.Marker | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map('map', {
        center: [center.lat, center.lng],
        zoom: 13,
        zoomControl: true,
        attributionControl: true,
      });

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // Set bounds if provided
      if (bounds) {
        map.setMaxBounds([
          [bounds.south, bounds.west],
          [bounds.north, bounds.east],
        ]);
      }

      // Handle map clicks for map picker mode
      if (mapPickerMode && onMapClick) {
        map.on('click', (e: L.LeafletMouseEvent) => {
          onMapClick(e.latlng.lat, e.latlng.lng);
        });
        map.getContainer().style.cursor = 'crosshair';
      }

      mapRef.current = map;
    }

    return () => {
      // Cleanup on unmount
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [center.lat, center.lng, bounds, mapPickerMode, onMapClick]);

  // Update markers when points change
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Create custom icons
    const coletaIcon = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    const abrigoIcon = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    // Add markers for each point
    points.forEach(point => {
      const marker = L.marker([point.lat, point.lng], {
        icon: point.tipo === 'coleta' ? coletaIcon : abrigoIcon,
        title: point.nome,
      });

      // Create popup content
      const popupContent = `
        <div class="map-popup">
          <h3 class="font-bold text-lg mb-2 text-gray-900">${point.nome}</h3>
          <div class="space-y-2 text-sm">
            <p class="flex items-start gap-2">
              <span class="font-semibold min-w-[80px]">Tipo:</span>
              <span class="flex items-center gap-1">
                <span class="w-3 h-3 rounded-full ${point.tipo === 'coleta' ? 'bg-red-600' : 'bg-yellow-600'}"></span>
                ${point.tipo === 'coleta' ? 'Ponto de Coleta' : 'Abrigo'}
              </span>
            </p>
            <p class="flex items-start gap-2">
              <span class="font-semibold min-w-[80px]">Endereço:</span>
              <span>${point.endereco}${point.complemento ? `, ${point.complemento}` : ''}</span>
            </p>
            ${point.doacoes && point.doacoes.length > 0 ? `
              <p class="flex items-start gap-2">
                <span class="font-semibold min-w-[80px]">Aceita:</span>
                <span>${point.doacoes.join(', ')}</span>
              </p>
            ` : ''}
            ${point.horarios ? `
              <p class="flex items-start gap-2">
                <span class="font-semibold min-w-[80px]">Horários:</span>
                <span>${point.horarios}</span>
              </p>
            ` : ''}
            ${point.responsavel ? `
              <p class="flex items-start gap-2">
                <span class="font-semibold min-w-[80px]">Responsável:</span>
                <span>${point.responsavel}</span>
              </p>
            ` : ''}
            ${point.telefone ? `
              <p class="flex items-start gap-2">
                <span class="font-semibold min-w-[80px]">Telefone:</span>
                <a href="tel:${point.telefone}" class="text-blue-600 hover:underline">${point.telefone}</a>
              </p>
            ` : ''}
            ${point.capacidade ? `
              <p class="flex items-start gap-2">
                <span class="font-semibold min-w-[80px]">Capacidade:</span>
                <span>${point.capacidade} pessoas</span>
              </p>
            ` : ''}
          </div>
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=${point.lat},${point.lng}"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
            </svg>
            Como Chegar
          </a>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'custom-popup',
      });

      marker.on('click', () => {
        if (onPointClick) {
          onPointClick(point);
        }
      });

      marker.addTo(mapRef.current!);
      markersRef.current.push(marker);
    });
  }, [points, onPointClick]);

  // Handle map picker selected location
  useEffect(() => {
    if (!mapRef.current) return;

    // Remove existing map picker marker
    if (mapPickerMarkerRef.current) {
      mapPickerMarkerRef.current.remove();
      mapPickerMarkerRef.current = null;
    }

    // Add new marker if location is selected
    if (selectedLocation && mapPickerMode) {
      const greenIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      const marker = L.marker([selectedLocation.lat, selectedLocation.lng], {
        icon: greenIcon,
        draggable: true,
      });

      marker.on('dragend', (e: L.DragEndEvent) => {
        const pos = e.target.getLatLng();
        if (onMapClick) {
          onMapClick(pos.lat, pos.lng);
        }
      });

      marker.addTo(mapRef.current);
      mapPickerMarkerRef.current = marker;

      // Pan to selected location
      mapRef.current.setView([selectedLocation.lat, selectedLocation.lng], 16, {
        animate: true,
      });
    }
  }, [selectedLocation, mapPickerMode, onMapClick]);

  return (
    <div id="map" className="w-full h-full" />
  );
}
