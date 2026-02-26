'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils/cn';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
  isVisible?: boolean;
}

export function Toast({
  message,
  type = 'info',
  duration = 3000,
  onClose,
  isVisible = true,
}: ToastProps) {
  const [show, setShow] = useState(isVisible);

  useEffect(() => {
    setShow(isVisible);
  }, [isVisible]);

  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        setShow(false);
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  const types = {
    success: {
      bg: 'bg-success',
      icon: '✓',
      border: 'border-green-700',
    },
    error: {
      bg: 'bg-error',
      icon: '✕',
      border: 'border-red-700',
    },
    info: {
      bg: 'bg-info',
      icon: 'ℹ',
      border: 'border-blue-700',
    },
    warning: {
      bg: 'bg-warning',
      icon: '⚠',
      border: 'border-yellow-700',
    },
  };

  const config = types[type];

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <div
        className={cn(
          'flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white min-w-[300px] max-w-md',
          config.bg,
          'border-2',
          config.border
        )}
        role="alert"
      >
        <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-white/20 font-bold">
          {config.icon}
        </div>
        <p className="flex-1 text-sm font-medium">{message}</p>
        {onClose && (
          <button
            onClick={() => {
              setShow(false);
              onClose();
            }}
            className="flex-shrink-0 p-1 rounded hover:bg-white/20 transition-colors"
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

// Animation for slide in from right
const slideInRightKeyframes = `
  @keyframes slide-in-right {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  .animate-slide-in-right {
    animation: slide-in-right 0.3s ease-out;
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = slideInRightKeyframes;
  document.head.appendChild(styleSheet);
}
