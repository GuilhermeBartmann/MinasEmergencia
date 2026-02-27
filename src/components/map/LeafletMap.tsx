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
  onCenterChange?: (lat: number, lng: number) => void;
  mapPickerMode?: boolean;
  selectedLocation?: { lat: number; lng: number } | null;
}

export default function LeafletMap({
  center,
  bounds,
  points,
  onPointClick,
  onMapClick,
  onCenterChange,
  mapPickerMode = false,
  selectedLocation,
}: LeafletMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const mapPickerMarkerRef = useRef<L.Marker | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) {
      const isMobile = window.innerWidth < 768;

      const map = L.map('map', {
        center: [center.lat, center.lng],
        zoom: isMobile ? 12 : 13,
        minZoom: 10,
        zoomControl: true,
        attributionControl: !isMobile, // Hide attribution on mobile to save space
      });

      // Position zoom controls on mobile to not overlap with legend
      if (isMobile) {
        map.zoomControl.setPosition('topright');
      }

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // Set bounds if provided
      if (bounds) {
        const padding = 0.05;
        map.setMaxBounds([
          [bounds.south - padding, bounds.west - padding],
          [bounds.north + padding, bounds.east + padding],
        ]);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center.lat, center.lng, bounds]);

  // Map picker mode: CSS pin at center (no Leaflet marker), moveend notifies parent
  useEffect(() => {
    if (!mapRef.current || !mapPickerMode) return;
    const map = mapRef.current;

    // Notifica o centro inicial
    const initial = map.getCenter();
    onCenterChange?.(initial.lat, initial.lng);

    // Após cada arrastar/zoom parar, notifica o novo centro
    const handleMoveEnd = () => {
      const c = map.getCenter();
      onCenterChange?.(c.lat, c.lng);
    };

    // Clique: pan suave para o ponto clicado, moveend notifica depois
    const handleClick = (e: L.LeafletMouseEvent) => {
      map.panTo(e.latlng, { animate: true, duration: 0.3 });
    };

    map.on('moveend', handleMoveEnd);
    map.on('click', handleClick);

    return () => {
      map.off('moveend', handleMoveEnd);
      map.off('click', handleClick);
    };
  }, [mapPickerMode, onCenterChange]);

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
        icon: point.tipo === 'abrigo' ? abrigoIcon : coletaIcon,
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
                <span class="w-3 h-3 rounded-full ${point.tipo === 'abrigo' ? 'bg-yellow-600' : 'bg-red-600'}"></span>
                ${point.tipo === 'abrigo' ? 'Abrigo' : 'Ponto de Coleta'}
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
            class="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-lg transition-colors text-sm font-semibold"
            style="background-color: #2563eb; color: #ffffff;"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
            </svg>
            Como Chegar
          </a>
        </div>
      `;

      const isMobile = window.innerWidth < 768;
      marker.bindPopup(popupContent, {
        maxWidth: isMobile ? 280 : 300,
        minWidth: isMobile ? 240 : 250,
        className: 'custom-popup',
        autoPan: true,
        autoPanPadding: isMobile ? [5, 5] : [50, 50],
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

  // Show confirmed location marker (only after picker mode ends)
  useEffect(() => {
    if (!mapRef.current) return;

    if (mapPickerMarkerRef.current) {
      mapPickerMarkerRef.current.remove();
      mapPickerMarkerRef.current = null;
    }

    // During picker mode the CSS pin handles the visual — skip Leaflet marker
    if (!selectedLocation || mapPickerMode) return;

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
    });

    marker.addTo(mapRef.current);
    mapPickerMarkerRef.current = marker;
  }, [selectedLocation, mapPickerMode]);

  return (
    <div id="map" className="w-full h-full" />
  );
}
