import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export const inputControlClassName =
  'h-11 w-full rounded-lg border border-neutral-300 bg-neutral-0 px-4 text-body-sm text-neutral-900 outline-none transition-colors duration-base ease-standard placeholder:text-neutral-500 focus:border-brand-blue-600 focus:ring-2 focus:ring-brand-blue-100 disabled:cursor-not-allowed disabled:bg-neutral-100';

type InputFieldProps = {
  id?: string;
  label: ReactNode;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
};

export const InputField = ({
  id,
  label,
  required = false,
  error,
  hint,
  className,
  children
}: InputFieldProps) => {
  const messageId = id ? `${id}-message` : undefined;

  return (
    <div className={cn('space-y-2', className)}>
      <label className="block text-body-sm font-semibold text-neutral-900" htmlFor={id}>
        {label}
        {required ? <span className="sr-only">필수 입력</span> : null}
      </label>
      {children}
      {error ? (
        <p id={messageId} className="text-xs text-state-error-700">
          {error}
        </p>
      ) : hint ? (
        <p id={messageId} className="text-xs text-neutral-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
};

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean;
};

type SelectInputProps = SelectHTMLAttributes<HTMLSelectElement> & {
  hasError?: boolean;
};

export const TextInput = ({ className, hasError = false, ...props }: TextInputProps) => (
  <input
    className={cn(
      inputControlClassName,
      hasError && 'border-state-error-600 focus:border-state-error-600 focus:ring-state-error-100',
      className
    )}
    {...props}
  />
);

export const SelectInput = ({ className, hasError = false, ...props }: SelectInputProps) => (
  <select
    className={cn(
      inputControlClassName,
      'appearance-none pr-10',
      hasError && 'border-state-error-600 focus:border-state-error-600 focus:ring-state-error-100',
      className
    )}
    {...props}
  />
);

type FieldInlineActionProps = {
  leading?: ReactNode;
  trailing?: ReactNode;
  className?: string;
  children: ReactNode;
};

export const FieldInlineAction = ({ leading, trailing, className, children }: FieldInlineActionProps) => (
  <div
    className={cn(
      'flex h-11 items-center gap-2 rounded-lg border border-brand-blue-100 bg-brand-blue-50 px-4 text-body-sm text-neutral-900',
      className
    )}
  >
    {leading ? <span className="text-brand-blue-600">{leading}</span> : null}
    <div className="min-w-0 flex-1 truncate">{children}</div>
    {trailing ? <div>{trailing}</div> : null}
  </div>
);
