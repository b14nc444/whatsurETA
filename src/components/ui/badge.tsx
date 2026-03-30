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
    default: 'bg-slate-700 text-white border-transparent',
    success: 'bg-emerald-700 text-white border-transparent',
    warning: 'bg-amber-700 text-white border-transparent',
    danger: 'bg-red-700 text-white border-transparent',
    info: 'bg-brand-600 text-white border-transparent'
  },
  soft: {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    success: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-100 text-amber-700 border-amber-200',
    danger: 'bg-red-100 text-red-700 border-red-200',
    info: 'bg-brand-50 text-brand-700 border-brand-100'
  },
  outline: {
    default: 'bg-transparent text-slate-700 border-slate-300',
    success: 'bg-transparent text-emerald-700 border-emerald-300',
    warning: 'bg-transparent text-amber-700 border-amber-300',
    danger: 'bg-transparent text-red-700 border-red-300',
    info: 'bg-transparent text-brand-700 border-brand-300'
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
