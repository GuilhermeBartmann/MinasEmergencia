'use client';

import { PointType } from '@/types/point';
import { cn } from '@/lib/utils/cn';

export interface TypeToggleProps {
  value: PointType;
  onChange: (type: PointType) => void;
  error?: string;
}

export function TypeToggle({ value, onChange, error }: TypeToggleProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Tipo de Ponto
        <span className="text-red-600 ml-1">*</span>
      </label>

      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => onChange('coleta')}
          className={cn(
            'flex flex-col items-center gap-2 p-4 border-2 rounded-lg transition-all',
            'hover:bg-gray-50',
            value === 'coleta'
              ? 'border-red-600 bg-red-50 ring-2 ring-red-600'
              : 'border-gray-300'
          )}
        >
          <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white text-2xl">
            📦
          </div>
          <div className="text-center">
            <p className="font-bold text-gray-900">Ponto de Coleta</p>
            <p className="text-xs text-gray-600 mt-1">
              Aceita doações de materiais
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onChange('abrigo')}
          className={cn(
            'flex flex-col items-center gap-2 p-4 border-2 rounded-lg transition-all',
            'hover:bg-gray-50',
            value === 'abrigo'
              ? 'border-yellow-600 bg-yellow-50 ring-2 ring-yellow-600'
              : 'border-gray-300'
          )}
        >
          <div className="w-12 h-12 rounded-full bg-yellow-600 flex items-center justify-center text-white text-2xl">
            🏠
          </div>
          <div className="text-center">
            <p className="font-bold text-gray-900">Abrigo</p>
            <p className="text-xs text-gray-600 mt-1">
              Acolhe pessoas desabrigadas
            </p>
          </div>
        </button>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
          <span>⚠</span>
          {error}
        </p>
      )}
    </div>
  );
}
