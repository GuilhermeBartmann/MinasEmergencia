'use client';

import { Badge } from '@/components/ui/Badge';

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
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 animate-pulse">
        <div className="flex flex-wrap gap-4 justify-center">
          <div className="h-16 w-32 bg-gray-200 rounded"></div>
          <div className="h-16 w-32 bg-gray-200 rounded"></div>
          <div className="h-16 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex flex-wrap gap-6 justify-center items-center">
        {/* Total Points */}
        <div className="text-center">
          <div className="text-4xl font-black text-emergency-600 mb-1">
            {totalPoints}
          </div>
          <div className="text-sm text-gray-600 font-semibold">
            Total de Pontos
          </div>
        </div>

        <div className="hidden sm:block w-px h-12 bg-gray-300" />

        {/* Collection Points */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Badge variant="error" size="lg">
              {coletaCount}
            </Badge>
          </div>
          <div className="text-sm text-gray-600 font-semibold flex items-center gap-1">
            <span className="w-3 h-3 bg-red-600 rounded-full"></span>
            Pontos de Coleta
          </div>
        </div>

        <div className="hidden sm:block w-px h-12 bg-gray-300" />

        {/* Shelters */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Badge variant="warning" size="lg">
              {abrigoCount}
            </Badge>
          </div>
          <div className="text-sm text-gray-600 font-semibold flex items-center gap-1">
            <span className="w-3 h-3 bg-yellow-600 rounded-full"></span>
            Abrigos
          </div>
        </div>
      </div>
    </div>
  );
}
