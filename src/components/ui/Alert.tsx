import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: ReactNode;
  icon?: ReactNode;
}

export function Alert({
  variant = 'info',
  title,
  children,
  icon,
  className,
  ...props
}: AlertProps) {
  const variants = {
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-900',
      icon: 'text-blue-600',
      title: 'text-blue-900',
    },
    success: {
      container: 'bg-green-50 border-green-200 text-green-900',
      icon: 'text-green-600',
      title: 'text-green-900',
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200 text-yellow-900',
      icon: 'text-yellow-600',
      title: 'text-yellow-900',
    },
    error: {
      container: 'bg-red-50 border-red-200 text-red-900',
      icon: 'text-red-600',
      title: 'text-red-900',
    },
  };

  const defaultIcons = {
    info: 'ℹ',
    success: '✓',
    warning: '⚠',
    error: '✕',
  };

  const config = variants[variant];

  return (
    <div
      className={cn(
        'flex gap-3 p-4 rounded-lg border-2',
        config.container,
        className
      )}
      role="alert"
      {...props}
    >
      {(icon || defaultIcons[variant]) && (
        <div className={cn('flex-shrink-0 text-xl font-bold', config.icon)}>
          {icon || defaultIcons[variant]}
        </div>
      )}
      <div className="flex-1">
        {title && (
          <h4 className={cn('font-bold mb-1', config.title)}>
            {title}
          </h4>
        )}
        <div className="text-sm">{children}</div>
      </div>
    </div>
  );
}
