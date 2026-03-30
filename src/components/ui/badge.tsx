import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type BadgeTone = 'default' | 'success' | 'warning' | 'danger' | 'info';
type BadgeSize = 'sm' | 'md';
type BadgeEmphasis = 'solid' | 'soft' | 'outline';

export type BadgeProps = {
  tone?: BadgeTone;
  size?: BadgeSize;
  emphasis?: BadgeEmphasis;
  className?: string;
  children: ReactNode;
};

const sizeClass: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-[11px]',
  md: 'px-2.5 py-1 text-xs'
};

const emphasisClass: Record<BadgeEmphasis, Record<BadgeTone, string>> = {
  solid: {
    default: 'bg-neutral-700 text-neutral-0 border-transparent',
    success: 'bg-state-success-700 text-neutral-0 border-transparent',
    warning: 'bg-state-warning-700 text-neutral-0 border-transparent',
    danger: 'bg-state-error-700 text-neutral-0 border-transparent',
    info: 'bg-brand-blue-600 text-neutral-0 border-transparent'
  },
  soft: {
    default: 'bg-neutral-100 text-neutral-700 border-neutral-200',
    success: 'bg-state-success-100 text-state-success-700 border-state-success-100',
    warning: 'bg-state-warning-100 text-state-warning-700 border-state-warning-100',
    danger: 'bg-state-error-100 text-state-error-700 border-state-error-100',
    info: 'bg-brand-blue-50 text-brand-blue-700 border-brand-blue-100'
  },
  outline: {
    default: 'bg-transparent text-neutral-700 border-neutral-300',
    success: 'bg-transparent text-state-success-700 border-state-success-600',
    warning: 'bg-transparent text-state-warning-700 border-state-warning-600',
    danger: 'bg-transparent text-state-error-700 border-state-error-600',
    info: 'bg-transparent text-brand-purple-700 border-brand-purple-600'
  }
};

export const Badge = ({
  tone = 'default',
  size = 'md',
  emphasis = 'soft',
  className,
  children
}: BadgeProps) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full border font-medium leading-none',
      sizeClass[size],
      emphasisClass[emphasis][tone],
      className
    )}
  >
    {children}
  </span>
);

type BadgeGroupProps = {
  className?: string;
  children: ReactNode;
};

export const BadgeGroup = ({ className, children }: BadgeGroupProps) => (
  <div className={cn('flex flex-wrap items-center gap-2', className)}>{children}</div>
);
