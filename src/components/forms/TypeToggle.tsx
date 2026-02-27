'use client';

import { useState, useRef, useEffect } from 'react';
import { PointType } from '@/types/point';
import { cn } from '@/lib/utils/cn';

export interface TypeToggleProps {
  value: PointType;
  onChange: (type: PointType) => void;
  error?: string;
}

const OPTIONS: { value: PointType; label: string }[] = [
  { value: 'coleta', label: '1 - Ponto de Coleta' },
  { value: 'abrigo', label: '2 - Abrigo' },
];

export function TypeToggle({ value, onChange, error }: TypeToggleProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selected = OPTIONS.find(o => o.value === value);

  return (
    <div className="w-full" ref={wrapperRef}>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        Selecionar tipo de ponto
        <span className="text-red-600 ml-1">*</span>
      </label>

      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className={cn(
          'w-full px-4 py-2.5 border-2 rounded-lg text-sm flex items-center justify-between bg-white transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-emergency-500',
          open
            ? 'border-emergency-500 rounded-b-none'
            : error
            ? 'border-red-500'
            : 'border-gray-300 hover:border-gray-400'
        )}
      >
        <span className="text-gray-900 font-medium">{selected?.label}</span>
        <svg
          className={cn('w-4 h-4 text-gray-500 transition-transform', open && 'rotate-180')}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="w-full border-2 border-t-0 border-emergency-500 rounded-b-lg bg-white overflow-hidden">
          {OPTIONS.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={cn(
                'w-full px-4 py-3 text-sm text-left transition-colors',
                value === opt.value
                  ? 'bg-emergency-50 text-emergency-700 font-semibold'
                  : 'text-gray-700 hover:bg-gray-50'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}
