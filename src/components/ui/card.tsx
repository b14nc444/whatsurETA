import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type CardTone = 'default' | 'muted' | 'danger' | 'warning';
type CardBorderStyle = 'default' | 'dashed' | 'none';
type CardPadding = 'sm' | 'md' | 'lg';
type CardPreset = 'default' | 'form' | 'content' | 'status' | 'ad-dashed';

type Props<T extends ElementType> = {
  as?: T;
  tone?: CardTone;
  borderStyle?: CardBorderStyle;
  padding?: CardPadding;
  preset?: CardPreset;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className' | 'children'>;

const toneClass: Record<CardTone, string> = {
  default: 'bg-neutral-0 text-neutral-900 border-neutral-200',
  muted: 'bg-neutral-50 text-neutral-700 border-neutral-200',
  danger: 'bg-state-error-50 text-state-error-700 border-state-error-100',
  warning: 'bg-state-warning-50 text-state-warning-700 border-state-warning-100'
};

const borderClass: Record<CardBorderStyle, string> = {
  default: 'border',
  dashed: 'border border-dashed',
  none: 'border-0'
};

const paddingClass: Record<CardPadding, string> = {
  sm: 'p-2',
  md: 'p-4',
  lg: 'p-6'
};

const presetClass: Record<CardPreset, string> = {
  default: '',
  form: 'rounded-2xl p-6 md:p-7',
  content: 'rounded-2xl p-6',
  status: 'rounded-xl p-4',
  'ad-dashed': 'rounded-2xl border-dashed p-10 text-center text-caption text-neutral-500'
};

export const Card = <T extends ElementType = 'section'>({
  as,
  tone = 'default',
  borderStyle = 'default',
  padding = 'md',
  preset = 'default',
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
      className={cn(
        'rounded-xl shadow-token-sm transition-colors duration-base ease-standard',
        toneClass[tone],
        borderClass[borderStyle],
        paddingClass[padding],
        presetClass[preset],
        className
      )}
    >
      {header}
      {children}
      {footer}
    </Component>
  );
};
