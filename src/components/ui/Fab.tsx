'use client';

import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface FabProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size?: 'md' | 'lg';
}

export function Fab({
  icon,
  children,
  position = 'bottom-right',
  size = 'lg',
  className,
  ...props
}: FabProps) {
  const positions = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
  };

  const sizes = {
    md: 'w-14 h-14 text-xl',
    lg: 'w-16 h-16 text-2xl',
  };

  return (
    <button
      className={cn(
        'fixed z-40 rounded-full bg-emergency-600 text-white shadow-2xl',
        'hover:bg-emergency-700 hover:scale-110',
        'active:scale-95',
        'transition-all duration-300',
        'focus:outline-none focus:ring-4 focus:ring-emergency-300',
        'flex items-center justify-center',
        positions[position],
        sizes[size],
        className
      )}
      aria-label="Botão de ação flutuante"
      {...props}
    >
      {icon || children || (
        <svg
          className="w-8 h-8"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M12 4v16m8-8H4" />
        </svg>
      )}
    </button>
  );
}
