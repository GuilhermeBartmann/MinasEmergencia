'use client';

import { useState, useEffect } from 'react';

export function MapLegend() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsCollapsed(mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mobile: badge compacto no canto, sem interação
  if (isMobile) {
    return (
      <div
        className="absolute z-[1001] bottom-24 left-3 bg-white/90 rounded-lg shadow-md p-1.5 flex flex-col gap-1"
      >
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-red-600 flex-shrink-0" />
          <span className="text-[10px] text-gray-700 leading-none">Coleta</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-yellow-600 flex-shrink-0" />
          <span className="text-[10px] text-gray-700 leading-none">Abrigo</span>
        </div>
      </div>
    );
  }

  // Desktop: legenda completa com toggle
  return (
    <div className={`absolute z-[1001] bottom-6 left-6 max-w-xs bg-white rounded-lg shadow-lg transition-all duration-300 ${isCollapsed ? 'p-2' : 'p-4'}`}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-bold text-gray-900 text-sm">Legenda do Mapa</h3>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex-shrink-0 text-gray-500 hover:text-gray-700 transition-colors text-sm"
          aria-label={isCollapsed ? 'Expandir legenda' : 'Minimizar legenda'}
        >
          {isCollapsed ? '▼' : '▲'}
        </button>
      </div>

      {!isCollapsed && (
        <>
          <div className="space-y-1 mt-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-600 border-2 border-white shadow flex-shrink-0" />
              <div className="text-sm">
                <p className="font-semibold text-gray-900">Ponto de Coleta</p>
                <p className="text-xs text-gray-600">Aceita doações</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-600 border-2 border-white shadow flex-shrink-0" />
              <div className="text-sm">
                <p className="font-semibold text-gray-900">Abrigo</p>
                <p className="text-xs text-gray-600">Acolhe pessoas</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-600 border-2 border-white shadow flex-shrink-0" />
              <div className="text-sm">
                <p className="font-semibold text-gray-900">Localização Selecionada</p>
                <p className="text-xs text-gray-600">Modo seleção de ponto</p>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">💡 Clique nos marcadores para ver detalhes</p>
          </div>
        </>
      )}
    </div>
  );
}
