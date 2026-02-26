'use client';

import { Badge } from './Badge';
import { cn } from '@/lib/utils/cn';

export interface NewPointsBadgeProps {
  count: number;
  onDismiss?: () => void;
  className?: string;
}

export function NewPointsBadge({ count, onDismiss, className }: NewPointsBadgeProps) {
  if (count === 0) return null;

  return (
    <div
      className={cn(
        'fixed top-24 left-1/2 transform -translate-x-1/2 z-[1000]',
        'animate-slide-down',
        className
      )}
    >
      <div className="bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">✓</span>
          <p className="font-semibold">
            {count} novo{count > 1 ? 's' : ''} ponto{count > 1 ? 's' : ''} adicionado{count > 1 ? 's' : ''}!
          </p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-2 p-1 hover:bg-green-700 rounded transition-colors"
            aria-label="Fechar notificação"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
