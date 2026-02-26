'use client';

import { useState, useEffect } from 'react';

export function MapLegend() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Auto-collapse on mobile initially
      setIsCollapsed(mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div
      className={`absolute z-[1001] bg-white rounded-lg shadow-lg transition-all duration-300
        ${isMobile
          ? 'left-3 right-3'
          : 'bottom-6 left-6 max-w-xs'
        }
        ${isCollapsed ? 'p-2' : isMobile ? 'p-3' : 'p-4'}
      `}
      style={isMobile ? { bottom: 'calc(env(safe-area-inset-bottom) + 70px)' } : {}}
    >
      {/* Header with toggle */}
      <div className="flex items-center justify-between gap-2">
        <h3 className={`font-bold text-gray-900 ${isMobile ? 'text-xs' : 'text-sm'}`}>
          Legenda do Mapa
        </h3>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`flex-shrink-0 text-gray-500 hover:text-gray-700 transition-colors ${isMobile ? 'text-xs' : 'text-sm'}`}
          aria-label={isCollapsed ? 'Expandir legenda' : 'Minimizar legenda'}
        >
          {isCollapsed ? '▼' : '▲'}
        </button>
      </div>

      {/* Legend content */}
      {!isCollapsed && (
        <>
          <div className={`space-y-1 ${isMobile ? 'mt-2' : 'mt-3'}`}>
            <div className="flex items-center gap-2">
              <div className={`flex-shrink-0 ${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`}>
                <div className={`rounded-full bg-red-600 border-2 border-white shadow ${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`}></div>
              </div>
              <div className={isMobile ? 'text-xs' : 'text-sm'}>
                <p className="font-semibold text-gray-900">Ponto de Coleta</p>
                {!isMobile && <p className="text-xs text-gray-600">Aceita doações</p>}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className={`flex-shrink-0 ${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`}>
                <div className={`rounded-full bg-yellow-600 border-2 border-white shadow ${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`}></div>
              </div>
              <div className={isMobile ? 'text-xs' : 'text-sm'}>
                <p className="font-semibold text-gray-900">Abrigo</p>
                {!isMobile && <p className="text-xs text-gray-600">Acolhe pessoas</p>}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className={`flex-shrink-0 ${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`}>
                <div className={`rounded-full bg-green-600 border-2 border-white shadow ${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`}></div>
              </div>
              <div className={isMobile ? 'text-xs' : 'text-sm'}>
                <p className="font-semibold text-gray-900">
                  {isMobile ? 'Selecionado' : 'Localização Selecionada'}
                </p>
                {!isMobile && <p className="text-xs text-gray-600">Modo seleção de ponto</p>}
              </div>
            </div>
          </div>

          {!isMobile && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                💡 Clique nos marcadores para ver detalhes
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
