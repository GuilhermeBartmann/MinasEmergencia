'use client';

import { DONATION_TYPES } from '@/types/point';
import { cn } from '@/lib/utils/cn';

export interface DonationCheckboxesProps {
  selectedDonations: string[];
  onChange: (donations: string[]) => void;
  error?: string;
}

export function DonationCheckboxes({
  selectedDonations,
  onChange,
  error,
}: DonationCheckboxesProps) {
  const handleToggle = (donation: string) => {
    if (selectedDonations.includes(donation)) {
      onChange(selectedDonations.filter(d => d !== donation));
    } else {
      onChange([...selectedDonations, donation]);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Tipos de Doação Aceitos
        <span className="text-red-600 ml-1">*</span>
      </label>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {DONATION_TYPES.map((donation) => (
          <label
            key={donation}
            className={cn(
              'flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-all',
              'hover:bg-gray-50',
              selectedDonations.includes(donation)
                ? 'border-emergency-500 bg-emergency-50'
                : 'border-gray-300'
            )}
          >
            <input
              type="checkbox"
              checked={selectedDonations.includes(donation)}
              onChange={() => handleToggle(donation)}
              className="w-5 h-5 text-emergency-600 border-gray-300 rounded focus:ring-emergency-500"
            />
            <span className="text-sm font-medium text-gray-700">
              {donation}
            </span>
          </label>
        ))}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
          <span>⚠</span>
          {error}
        </p>
      )}

      <p className="mt-2 text-sm text-gray-500">
        Selecione todos os tipos de doação que o ponto aceita
      </p>
    </div>
  );
}
