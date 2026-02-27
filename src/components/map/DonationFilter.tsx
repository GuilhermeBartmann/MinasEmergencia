'use client';

import { DONATION_TYPES } from '@/types/point';

interface DonationFilterProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDonations: string[];
  onChange: (donations: string[]) => void;
  totalPoints: number;
  filteredCount: number;
}

const ICONS: Record<string, string> = {
  Roupas: '👕',
  Alimentos: '🥫',
  Água: '💧',
  Higiene: '🧼',
  Medicamentos: '💊',
  Outros: '📦',
};

export function DonationFilter({
  isOpen,
  onClose,
  selectedDonations,
  onChange,
  totalPoints,
  filteredCount,
}: DonationFilterProps) {
  const hasFilter = selectedDonations.length > 0;

  function toggle(donation: string) {
    onChange(
      selectedDonations.includes(donation)
        ? selectedDonations.filter(d => d !== donation)
        : [...selectedDonations, donation]
    );
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2001] flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative w-full max-w-lg bg-white rounded-t-2xl shadow-2xl animate-slide-up">
        {/* Handle */}
        <div className="flex justify-center pt-3">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        <div className="px-5 pt-3 pb-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Filtrar doações</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Selecione o que precisa encontrar
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Chips */}
          <div className="grid grid-cols-3 gap-2.5">
            {DONATION_TYPES.map(donation => {
              const active = selectedDonations.includes(donation);
              return (
                <button
                  key={donation}
                  onClick={() => toggle(donation)}
                  className={`
                    flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2
                    transition-all duration-150 select-none
                    ${active
                      ? 'border-emergency-500 bg-emergency-50 shadow-sm'
                      : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                    }
                  `}
                >
                  <span className="text-2xl leading-none">{ICONS[donation]}</span>
                  <span className={`text-xs font-semibold leading-tight text-center ${
                    active ? 'text-emergency-700' : 'text-gray-600'
                  }`}>
                    {donation}
                  </span>
                  {active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emergency-500" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-5 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {hasFilter ? (
                <>
                  <span className="font-semibold text-gray-900">{filteredCount}</span>
                  {' '}de {totalPoints} pontos
                </>
              ) : (
                <><span className="font-semibold text-gray-900">{totalPoints}</span> pontos</>
              )}
            </span>

            <div className="flex gap-2">
              {hasFilter && (
                <button
                  onClick={() => onChange([])}
                  className="px-4 py-2 text-sm font-semibold text-gray-500 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  Limpar
                </button>
              )}
              <button
                onClick={onClose}
                className="px-5 py-2 text-sm font-semibold text-white bg-emergency-600 rounded-xl hover:bg-emergency-700 transition-colors"
              >
                {hasFilter ? `Ver ${filteredCount} pontos` : 'Fechar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
