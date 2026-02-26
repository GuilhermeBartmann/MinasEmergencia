'use client';

import { Badge } from '@/components/ui/Badge';
import { useState, useEffect } from 'react';

export interface CityStatsProps {
  totalPoints?: number;
  coletaCount?: number;
  abrigoCount?: number;
  isLoading?: boolean;
}

export function CityStats({
  totalPoints = 0,
  coletaCount = 0,
  abrigoCount = 0,
  isLoading = false,
}: CityStatsProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-md animate-pulse ${isMobile ? 'p-3 mb-2' : 'p-6 mb-8'}`}>
        <div className="flex flex-wrap gap-4 justify-center">
          <div className="h-16 w-32 bg-gray-200 rounded"></div>
          <div className="h-16 w-32 bg-gray-200 rounded"></div>
          <div className="h-16 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md ${isMobile ? 'p-3 mb-2' : 'p-6 mb-8'}`}>
      <div className={`flex flex-wrap justify-center items-center ${isMobile ? 'gap-3' : 'gap-6'}`}>
        {/* Total Points */}
        <div className="text-center">
          <div className={`font-black text-emergency-600 mb-1 ${isMobile ? 'text-3xl' : 'text-4xl'}`}>
            {totalPoints}
          </div>
          <div className={`text-gray-600 font-semibold ${isMobile ? 'text-xs' : 'text-sm'}`}>
            Total de Pontos
          </div>
        </div>

        <div className="hidden sm:block w-px h-12 bg-gray-300" />

        {/* Collection Points */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Badge variant="error" size={isMobile ? 'md' : 'lg'}>
              {coletaCount}
            </Badge>
          </div>
          <div className={`text-gray-600 font-semibold flex items-center gap-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
            <span className={`bg-red-600 rounded-full ${isMobile ? 'w-2 h-2' : 'w-3 h-3'}`}></span>
            {isMobile ? 'Pontos' : 'Pontos de Coleta'}
          </div>
        </div>

        <div className="hidden sm:block w-px h-12 bg-gray-300" />

        {/* Shelters */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Badge variant="warning" size={isMobile ? 'md' : 'lg'}>
              {abrigoCount}
            </Badge>
          </div>
          <div className={`text-gray-600 font-semibold flex items-center gap-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
            <span className={`bg-yellow-600 rounded-full ${isMobile ? 'w-2 h-2' : 'w-3 h-3'}`}></span>
            Abrigos
          </div>
        </div>
      </div>
    </div>
  );
}
