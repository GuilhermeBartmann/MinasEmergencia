'use client';

import { cn } from '@/lib/utils/cn';

export interface MobileNavbarProps {
  activeTab: 'map' | 'form';
  onTabChange: (tab: 'map' | 'form') => void;
  onFilterClick: () => void;
  hasActiveFilter?: boolean;
}

export function MobileNavbar({
  activeTab,
  onTabChange,
  onFilterClick,
  hasActiveFilter = false,
}: MobileNavbarProps) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-lg z-30">
      <div className="grid grid-cols-3">
        {/* Mapa */}
        <button
          onClick={() => onTabChange('map')}
          className={cn(
            'flex flex-col items-center justify-center py-3 transition-colors',
            activeTab === 'map'
              ? 'bg-emergency-50 text-emergency-600 border-t-4 border-emergency-600'
              : 'text-gray-600 hover:bg-gray-50'
          )}
          aria-label="Ver mapa"
        >
          <svg className="w-5 h-5 mb-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <span className="text-xs font-semibold">Mapa</span>
        </button>

        {/* Filtrar */}
        <button
          onClick={onFilterClick}
          className={cn(
            'relative flex flex-col items-center justify-center py-3 transition-colors',
            hasActiveFilter
              ? 'text-emergency-600'
              : 'text-gray-600 hover:bg-gray-50'
          )}
          aria-label="Filtrar pontos"
        >
          {hasActiveFilter && (
            <span className="absolute top-2 right-5 w-2 h-2 bg-emergency-500 rounded-full" />
          )}
          <svg className="w-5 h-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
          <span className="text-xs font-semibold">Filtrar</span>
        </button>

        {/* Cadastrar */}
        <button
          onClick={() => onTabChange('form')}
          className={cn(
            'flex flex-col items-center justify-center py-3 transition-colors',
            activeTab === 'form'
              ? 'bg-emergency-50 text-emergency-600 border-t-4 border-emergency-600'
              : 'text-gray-600 hover:bg-gray-50'
          )}
          aria-label="Cadastrar ponto"
        >
          <svg className="w-5 h-5 mb-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-xs font-semibold">Cadastrar</span>
        </button>
      </div>
    </nav>
  );
}
