import type { ButtonHTMLAttributes, ReactElement, ReactNode } from 'react';
import { cloneElement, isValidElement } from 'react';
import { cn } from '@/lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

const variantClass: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-600 text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50',
  secondary:
    'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50'
};

const sizeClass: Record<ButtonSize, string> = {
  sm: 'rounded-md px-3 py-1.5 text-xs font-semibold',
  md: 'rounded-lg px-4 py-2 text-sm font-semibold',
  lg: 'rounded-lg px-5 py-2.5 text-base font-semibold'
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  loadingText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  asChild?: boolean;
};

export const Button = ({
  variant = 'secondary',
  size = 'md',
  loading = false,
  loadingText = '처리 중...',
  leftIcon,
  rightIcon,
  fullWidth = false,
  asChild = false,
  className,
  children,
  disabled,
  type = 'button',
  ...props
}: ButtonProps) => {
  const isDisabled = disabled || loading;
  const classes = cn(
    'inline-flex items-center justify-center gap-1.5 transition outline-none focus-visible:ring-2 focus-visible:ring-brand-100 focus-visible:ring-offset-1',
    variantClass[variant],
    sizeClass[size],
    fullWidth && 'w-full',
    className
  );

  const content = (
    <>
      {leftIcon ? <span aria-hidden>{leftIcon}</span> : null}
      <span>{loading ? loadingText : children}</span>
      {rightIcon ? <span aria-hidden>{rightIcon}</span> : null}
    </>
  );

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{ className?: string; 'aria-disabled'?: boolean }>;
    return cloneElement(child, {
      className: cn(classes, child.props.className),
      'aria-disabled': isDisabled || undefined
    });
  }

  return (
    <button type={type} className={classes} disabled={isDisabled} {...props}>
      {content}
    </button>
  );
};
