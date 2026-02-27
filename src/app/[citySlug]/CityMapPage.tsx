'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { City } from '@/types/city';
import { useRealtime } from '@/hooks/useRealtime';
import { Header } from '@/components/layout/Header';
import { MapView } from '@/components/map/MapView';
import { MapLegend } from '@/components/map/MapLegend';
import { DonationFilter } from '@/components/map/DonationFilter';
import { CityStats } from '@/components/city/CityStats';
import { PointForm } from '@/components/forms/PointForm';
import { Modal } from '@/components/ui/Modal';
import { Fab } from '@/components/ui/Fab';
import { MobileNavbar } from '@/components/layout/MobileNavbar';
import { Alert } from '@/components/ui/Alert';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { NewPointsBadge } from '@/components/ui/NewPointsBadge';
import { CityPageStructuredData } from '@/components/seo/StructuredData';
import { cn } from '@/lib/utils/cn';

export function CityMapPage({ city }: { city: City }) {
  // Use real-time hook instead of polling
  const { points, loading, error, newPointsCount, resetNewPointsCount } = useRealtime(
    city.collectionName,
    [], // No initial points
    { limitCount: 500, enabled: true }
  );

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileTab, setMobileTab] = useState<'map' | 'form'>('map');
  const [selectedDonations, setSelectedDonations] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [mapPickerMode, setMapPickerMode] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [pendingAddress, setPendingAddress] = useState<string | null>(null);
  const [addressLoading, setAddressLoading] = useState(false);
  const addressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const abrigoCount = points.filter(p => p.tipo === 'abrigo').length;
  const coletaCount = points.length - abrigoCount;

  const filteredPoints = selectedDonations.length > 0
    ? points.filter(p => selectedDonations.some(d => p.doacoes?.includes(d)))
    : points;

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-dismiss new points badge after 5 seconds
  useEffect(() => {
    if (newPointsCount > 0) {
      const timer = setTimeout(() => {
        resetNewPointsCount();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [newPointsCount, resetNewPointsCount]);

  const handleFormOpen = () => {
    if (isMobile) {
      setMobileTab('form');
    } else {
      setIsFormOpen(true);
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setMobileTab('map');
    setMapPickerMode(false);
    setSelectedLocation(null);
    // No need to refetch - real-time listener will update automatically!
  };

  const fetchAddress = useCallback((lat: number, lng: number) => {
    if (addressTimerRef.current) clearTimeout(addressTimerRef.current);
    setAddressLoading(true);
    setPendingAddress(null);
    // 1100ms debounce — respeita o limite de 1 req/s do Nominatim
    addressTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/reverse-geocode?lat=${lat}&lng=${lng}`);
        const data = await res.json();
        setPendingAddress(data.address ?? null);
      } catch {
        setPendingAddress(null);
      } finally {
        setAddressLoading(false);
      }
    }, 1100);
  }, []);

  // Fires after map stops moving (moveend) — stable, no conflict with click
  const handleCenterChange = useCallback((lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
    fetchAddress(lat, lng);
  }, [fetchAddress]);

  const handleConfirmLocation = (confirmed: boolean) => {
    if (addressTimerRef.current) clearTimeout(addressTimerRef.current);
    setMapPickerMode(false);
    setPendingAddress(null);
    if (!confirmed) {
      setSelectedLocation(null);
    }
    if (!isMobile) {
      setIsFormOpen(true);
    } else {
      setMobileTab('form');
    }
  };

  const handleMapPickerToggle = (enabled: boolean) => {
    setMapPickerMode(enabled);
    if (enabled && !isMobile) {
      setIsFormOpen(false);
    }
    if (!enabled) {
      if (addressTimerRef.current) clearTimeout(addressTimerRef.current);
      setPendingAddress(null);
    }
  };

  if (loading && points.length === 0) {
    return (
      <div className="h-screen flex flex-col">
        <Header title={`Emergência ${city.name}`} showBackButton />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="xl" />
            <p className="mt-4 text-gray-600 font-medium">
              Carregando pontos de {city.name}...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col">
        <Header title={`Emergência ${city.name}`} showBackButton />
        <div className="flex-1 flex items-center justify-center p-4">
          <Alert variant="error">
            <p className="font-semibold mb-2">Erro ao conectar</p>
            <p className="text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 text-sm underline hover:no-underline"
            >
              Recarregar página
            </button>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* SEO Structured Data */}
      <CityPageStructuredData
        cityName={city.name}
        citySlug={city.slug}
        description={city.metadata.description}
        lat={city.coordinates.lat}
        lng={city.coordinates.lng}
      />

      <div className="h-screen flex flex-col">
        {/* Header */}
        <Header title={`Emergência ${city.name}`} showBackButton />

      {/* New Points Badge */}
      <NewPointsBadge
        count={newPointsCount}
        onDismiss={resetNewPointsCount}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Stats - Always visible */}
        <div className={cn(
          "container mx-auto flex-shrink-0",
          isMobile ? "px-3 py-2" : "px-4 py-4"
        )}>
          <CityStats
            totalPoints={points.length}
            coletaCount={coletaCount}
            abrigoCount={abrigoCount}
          />

        </div>

        {/* Map + Form Container */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Map Section */}
          <div
            className={cn(
              'relative',
              isMobile
                ? mobileTab === 'map' ? 'w-full' : 'hidden'
                : 'flex-1'
            )}
          >
            {/* Info Alert - Desktop only, above map */}

            <MapView
              city={city}
              points={filteredPoints}
              onPointClick={(point) => console.log('Point clicked:', point)}
              mapPickerMode={mapPickerMode}
              onCenterChange={handleCenterChange}
              selectedLocation={selectedLocation}
            />

            {/* CSS pin fixed at map center — follows map drag naturally */}
            {mapPickerMode && (
              <img
                src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png"
                alt="pin"
                className="absolute pointer-events-none z-[1000]"
                style={{
                  width: 25,
                  height: 41,
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -100%)',
                }}
              />
            )}

            <MapLegend />

            {/* Confirmation box — compact, above the pin */}
            {mapPickerMode && (
              <div
                className="absolute left-1/2 -translate-x-1/2 z-[2000] bg-white rounded-lg shadow-xl pointer-events-auto"
                style={{ bottom: 'calc(50% + 48px)', width: '180px', padding: '8px 10px' }}
              >
                <p className="text-xs font-bold text-gray-900 text-center leading-tight">
                  📍 Confirmar local?
                </p>
                <p className="text-[10px] text-gray-500 text-center mt-0.5 mb-2 leading-tight truncate">
                  {addressLoading
                    ? 'Buscando endereço...'
                    : pendingAddress ?? 'Mova o mapa para posicionar'}
                </p>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleConfirmLocation(false)}
                    className="flex-1 py-1 text-xs border border-gray-300 rounded font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Não
                  </button>
                  <button
                    onClick={() => handleConfirmLocation(true)}
                    className="flex-1 py-1 text-xs bg-green-600 text-white rounded font-semibold hover:bg-green-700 transition-colors"
                  >
                    Sim
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Form Section - Mobile */}
          {isMobile && mobileTab === 'form' && (
            <div className="w-full h-full overflow-y-auto bg-white p-4 pb-20">
              <h2 className="text-2xl font-bold text-emergency-600 mb-4">
                Cadastrar Ponto
              </h2>
              <PointForm
                citySlug={city.slug}
                onSuccess={handleFormSuccess}
                onMapPickerToggle={(enabled) => {
                  handleMapPickerToggle(enabled);
                  if (enabled) {
                    setMobileTab('map');
                  }
                }}
                selectedLocation={selectedLocation}
              />
            </div>
          )}
        </div>
      </main>

      {/* Mobile Navbar */}
      {isMobile && (
        <MobileNavbar
          activeTab={mobileTab}
          onTabChange={setMobileTab}
          onFilterClick={() => setIsFilterOpen(true)}
          hasActiveFilter={selectedDonations.length > 0}
        />
      )}

      {/* Desktop — botões Filtrar + Cadastrar */}
      {!isMobile && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
          <button
            onClick={() => setIsFilterOpen(true)}
            className={cn(
              'flex items-center gap-2 px-4 py-3 rounded-full font-semibold text-sm shadow-lg transition-all duration-200',
              selectedDonations.length > 0
                ? 'bg-emergency-600 text-white hover:bg-emergency-700'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
            )}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            Filtrar
            {selectedDonations.length > 0 && (
              <span className="bg-white/30 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {selectedDonations.length}
              </span>
            )}
          </button>

          <Fab
            position="bottom-right"
            onClick={handleFormOpen}
            aria-label="Cadastrar novo ponto"
            className="!relative !bottom-auto !right-auto"
          />
        </div>
      )}

      {/* Filter sheet — mobile + desktop */}
      <DonationFilter
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        selectedDonations={selectedDonations}
        onChange={setSelectedDonations}
        totalPoints={points.length}
        filteredCount={filteredPoints.length}
      />

      {/* Desktop Modal */}
      {!isMobile && (
        <Modal
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setMapPickerMode(false);
          }}
          title="Cadastrar Novo Ponto"
          size="lg"
        >
          <PointForm
            citySlug={city.slug}
            onSuccess={handleFormSuccess}
            onMapPickerToggle={handleMapPickerToggle}
            selectedLocation={selectedLocation}
          />
        </Modal>
      )}
      </div>
    </>
  );
}
