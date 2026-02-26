'use client';

import { useState, useEffect } from 'react';
import { City } from '@/types/city';
import { useRealtime } from '@/hooks/useRealtime';
import { Header } from '@/components/layout/Header';
import { MapView } from '@/components/map/MapView';
import { MapLegend } from '@/components/map/MapLegend';
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
  const [mapPickerMode, setMapPickerMode] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);

  const coletaCount = points.filter(p => p.tipo === 'coleta').length;
  const abrigoCount = points.filter(p => p.tipo === 'abrigo').length;

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

  const handleMapClick = (lat: number, lng: number) => {
    if (mapPickerMode) {
      setSelectedLocation({ lat, lng });
    }
  };

  const handleMapPickerToggle = (enabled: boolean) => {
    setMapPickerMode(enabled);
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
            <p className="mt-2 text-sm text-gray-500">
              Conectando em tempo real...
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
        <div className="container mx-auto px-4 py-4 flex-shrink-0">
          <CityStats
            totalPoints={points.length}
            coletaCount={coletaCount}
            abrigoCount={abrigoCount}
          />

          {/* Real-time indicator */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Atualizações em tempo real ativas</span>
          </div>
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
            {!isMobile && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] max-w-2xl px-4">
                <Alert variant="info" className="shadow-lg">
                  <p className="font-semibold mb-1 text-sm">Como usar:</p>
                  <ul className="text-xs space-y-0.5">
                    <li>• Clique nos marcadores para ver detalhes</li>
                    <li>• Use "Como Chegar" para navegação</li>
                    <li>• Novos pontos aparecem automaticamente</li>
                    <li>• Cadastre pontos com o botão "+"</li>
                  </ul>
                </Alert>
              </div>
            )}

            <MapView
              city={city}
              points={points}
              onPointClick={(point) => console.log('Point clicked:', point)}
              mapPickerMode={mapPickerMode}
              onMapClick={handleMapClick}
              selectedLocation={selectedLocation}
            />
            <MapLegend />
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
        />
      )}

      {/* Desktop FAB */}
      {!isMobile && (
        <Fab
          position="bottom-right"
          onClick={handleFormOpen}
          aria-label="Cadastrar novo ponto"
        />
      )}

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
