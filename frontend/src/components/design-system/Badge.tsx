'use client';

import { ReactNode } from 'react';

interface BadgeVariant {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
  size?: 'sm' | 'md';
}

const variantStyles = {
  default: 'bg-white/10 text-white/80',
  success: 'bg-green-500/20 text-green-400 border border-green-500/30',
  warning: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  danger: 'bg-red-500/20 text-red-400 border border-red-500/30',
  info: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  outline: 'bg-transparent border border-white/30 text-white/80',
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
};

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant['variant'];
  size?: BadgeVariant['size'];
  className?: string;
}

export function Badge({ 
  children, 
  variant = 'default', 
  size = 'sm', 
  className = '' 
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

interface StatusDotProps {
  status: 'online' | 'offline' | 'busy' | 'away' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  pulse?: boolean;
  className?: string;
}

const dotColors = {
  online: 'bg-green-500',
  offline: 'bg-gray-500',
  busy: 'bg-red-500',
  away: 'bg-yellow-500',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  danger: 'bg-red-500',
  info: 'bg-blue-500',
};

const dotSizes = {
  sm: 'w-2 h-2',
  md: 'w-3 h-3',
};

export function StatusDot({ 
  status, 
  size = 'md', 
  pulse = false,
  className = '' 
}: StatusDotProps) {
  return (
    <span
      className={`
        inline-block rounded-full
        ${dotColors[status]}
        ${dotSizes[size]}
        ${pulse ? 'animate-pulse' : ''}
        ${className}
      `}
    />
  );
}
