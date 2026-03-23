'use client';

import { ReactNode } from 'react';

type CardVariant = 'default' | 'elevated' | 'outlined' | 'gradient';
type CardPadding = 'none' | 'sm' | 'md' | 'lg';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: CardVariant;
  padding?: CardPadding;
  onClick?: () => void;
  hover?: boolean;
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-dark-card border border-white/10',
  elevated: 'bg-dark-card border border-white/10 shadow-xl shadow-black/20',
  outlined: 'bg-transparent border border-white/20',
  gradient: 'bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30',
};

const paddingStyles: Record<CardPadding, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export function Card({ 
  children, 
  className = '', 
  variant = 'default', 
  padding = 'md',
  onClick,
  hover = false,
}: CardProps) {
  return (
    <div
      className={`
        rounded-xl transition-all duration-200
        ${variantStyles[variant]}
        ${paddingStyles[padding]}
        ${hover ? 'hover:border-white/20 hover:shadow-lg cursor-pointer' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}

export function CardHeader({ children, className = '', action }: CardHeaderProps) {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      <div className="text-lg font-semibold text-white">{children}</div>
      {action && <div>{action}</div>}
    </div>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return <div className={className}>{children}</div>;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div className={`mt-4 pt-4 border-t border-white/10 ${className}`}>
      {children}
    </div>
  );
}
