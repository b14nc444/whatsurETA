import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export const inputControlClassName =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-600 focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-slate-100';

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
      <label className="block text-sm font-medium text-slate-700" htmlFor={id}>
        {label}
        {required ? <span className="sr-only">필수 입력</span> : null}
      </label>
      {children}
      {error ? (
        <p id={messageId} className="text-xs text-red-700">
          {error}
        </p>
      ) : hint ? (
        <p id={messageId} className="text-xs text-slate-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
};

type TextInputProps = InputHTMLAttributes<HTMLInputElement>;
type SelectInputProps = SelectHTMLAttributes<HTMLSelectElement>;

export const TextInput = ({ className, ...props }: TextInputProps) => (
  <input className={cn(inputControlClassName, className)} {...props} />
);

export const SelectInput = ({ className, ...props }: SelectInputProps) => (
  <select className={cn(inputControlClassName, className)} {...props} />
);
