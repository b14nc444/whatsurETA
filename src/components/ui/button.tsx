import type { ButtonHTMLAttributes, ReactElement, ReactNode } from 'react';
import { cloneElement, isValidElement } from 'react';
import { cn } from '@/lib/cn';

type ButtonVariant = 'primary-gradient' | 'primary' | 'secondary-outline' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

const variantClass: Record<ButtonVariant, string> = {
  'primary-gradient':
    'border border-transparent bg-[image:var(--gradient-brand)] text-neutral-0 shadow-token-sm hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50',
  primary:
    'border border-transparent bg-[image:var(--gradient-brand)] text-neutral-0 shadow-token-sm hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50',
  'secondary-outline':
    'border border-neutral-300 bg-neutral-0 text-neutral-700 hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50',
  secondary:
    'border border-neutral-300 bg-neutral-0 text-neutral-700 hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50',
  ghost:
    'border border-transparent bg-transparent text-brand-blue-600 hover:bg-brand-blue-50 disabled:cursor-not-allowed disabled:opacity-50'
};

const sizeClass: Record<ButtonSize, string> = {
  sm: 'h-8 rounded-md px-3 text-caption font-semibold',
  md: 'h-11 rounded-lg px-4 text-body-sm font-semibold',
  lg: 'h-14 rounded-xl px-6 text-body-md font-semibold'
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
  variant = 'secondary-outline',
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
    'inline-flex items-center justify-center gap-1.5 transition-transform transition-colors duration-base ease-standard outline-none focus-visible:ring-2 focus-visible:ring-brand-blue-100 focus-visible:ring-offset-1',
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
