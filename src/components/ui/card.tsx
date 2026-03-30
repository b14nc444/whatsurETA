import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type CardTone = 'default' | 'muted' | 'danger' | 'warning';
type CardBorderStyle = 'default' | 'dashed' | 'none';
type CardPadding = 'sm' | 'md' | 'lg';

type Props<T extends ElementType> = {
  as?: T;
  tone?: CardTone;
  borderStyle?: CardBorderStyle;
  padding?: CardPadding;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className' | 'children'>;

const toneClass: Record<CardTone, string> = {
  default: 'bg-white text-slate-900 border-slate-200',
  muted: 'bg-slate-50 text-slate-700 border-slate-200',
  danger: 'bg-red-50 text-red-900 border-red-200',
  warning: 'bg-amber-50 text-amber-900 border-amber-200'
};

const borderClass: Record<CardBorderStyle, string> = {
  default: 'border',
  dashed: 'border border-dashed',
  none: 'border-0'
};

const paddingClass: Record<CardPadding, string> = {
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-5'
};

export const Card = <T extends ElementType = 'section'>({
  as,
  tone = 'default',
  borderStyle = 'default',
  padding = 'md',
  header,
  footer,
  className,
  children,
  ...props
}: Props<T>) => {
  const Component = as ?? 'section';
  return (
    <Component
      {...props}
      className={cn('rounded-xl shadow-sm', toneClass[tone], borderClass[borderStyle], paddingClass[padding], className)}
    >
      {header}
      {children}
      {footer}
    </Component>
  );
};
