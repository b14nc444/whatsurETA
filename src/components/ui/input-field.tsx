import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export const inputControlClassName =
  'w-full rounded-xl border border-neutral-300 bg-neutral-0 px-3 py-2 text-sm text-neutral-900 outline-none transition-colors duration-base ease-standard placeholder:text-neutral-500 focus:border-brand-blue-600 focus:ring-2 focus:ring-brand-blue-100 disabled:cursor-not-allowed disabled:bg-neutral-100';

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
    <div className={cn('space-y-1', className)}>
      <label className="block text-sm font-medium text-neutral-700" htmlFor={id}>
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
      hasError && 'border-state-error-600 focus:border-state-error-600 focus:ring-state-error-100',
      className
    )}
    {...props}
  />
);
