import type { ButtonHTMLAttributes, ReactElement, ReactNode } from 'react';
import { cloneElement, isValidElement } from 'react';
import { cn } from '@/lib/cn';

type ButtonVariant = 'primary-gradient' | 'primary' | 'secondary-outline' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

const variantClass: Record<ButtonVariant, string> = {
  'primary-gradient':
    'disabled:cursor-not-allowed',
  primary:
    'disabled:cursor-not-allowed',
  'secondary-outline':
    'border border-neutral-300 bg-neutral-0 text-neutral-700 hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50',
  secondary:
    'border border-neutral-300 bg-neutral-0 text-neutral-700 hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50',
  ghost:
    'border border-transparent bg-transparent text-brand-blue-600 hover:bg-brand-blue-50 disabled:cursor-not-allowed disabled:opacity-50'
};

const sizeClass: Record<ButtonSize, string> = {
  sm: 'h-8 rounded-md px-3 text-caption font-semibold',
  md: 'h-11 rounded-md px-4 text-body-sm font-semibold',
  lg: "h-14 rounded-2xl px-4 py-3.5 text-base font-normal"
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
  const isPrimaryLike = variant === 'primary-gradient' || variant === 'primary';
  const primaryStateClass = isPrimaryLike
    ? loading
      ? 'bg-[image:linear-gradient(90deg,rgba(21,93,252,0.40)_0%,rgba(152,16,250,0.40)_100%),linear-gradient(#F3F3F3,#F3F3F3)] text-white font-bold outline outline-1 outline-offset-[-1px] outline-transparent'
      : isDisabled
        ? 'bg-[#F3F3F3] text-neutral-950/50 font-normal'
        : 'bg-gradient-to-r from-[#155DFC] to-[#9810FA] text-white font-bold outline outline-1 outline-offset-[-1px] outline-transparent'
    : '';

  const classes = cn(
    'inline-flex items-center justify-center gap-1.5 overflow-hidden text-center transition-transform transition-colors duration-base ease-standard outline-none focus-visible:ring-2 focus-visible:ring-brand-blue-100 focus-visible:ring-offset-1',
    variantClass[variant],
    primaryStateClass,
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
