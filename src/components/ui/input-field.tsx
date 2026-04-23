import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export const inputControlClassName =
  "h-14 w-full rounded-2xl bg-neutral-0 px-4 py-3.5 text-base font-normal text-neutral-950 outline outline-1 outline-offset-[-1px] outline-neutral-300 transition-colors duration-base ease-standard placeholder:text-neutral-950/50 hover:outline-brand-blue-600 focus:bg-neutral-0 focus:outline-brand-blue-600 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-500";

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
    <div className={cn('space-y-3', className)}>
      <label className="block text-sm font-bold leading-5 text-gray-900" htmlFor={id}>
        {label}
        {required ? <span className="sr-only">필수 입력</span> : null}
      </label>
      <div className={cn(error || hint ? 'w-full space-y-2' : 'w-full')}>
        {children}
        {error ? (
          <p id={messageId} className="w-full text-sm font-normal text-rose-500">
            {error}
          </p>
        ) : hint ? (
          <p id={messageId} className="w-full text-xs text-neutral-500">
            {hint}
          </p>
        ) : null}
      </div>
    </div>
  );
};

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean;
};

type SelectInputProps = SelectHTMLAttributes<HTMLSelectElement> & {
  hasError?: boolean;
};

const hasInputValue = (value: unknown): boolean => {
  if (typeof value === 'string') return value.length > 0;
  if (typeof value === 'number') return true;
  return false;
};

export const TextInput = ({ className, hasError = false, ...props }: TextInputProps) => (
  <input
    className={cn(
      inputControlClassName,
      hasInputValue(props.value) &&
        !hasError &&
        'bg-[#155DFC1A] outline-[#155DFC66] hover:outline-[#155DFC66] focus:bg-[#155DFC1A] focus:outline-[#155DFC66]',
      hasError && 'bg-neutral-0 outline-rose-500 hover:outline-rose-500 focus:outline-rose-500',
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
      hasInputValue(props.value) &&
        !hasError &&
        'bg-[#155DFC1A] outline-[#155DFC66] hover:outline-[#155DFC66] focus:bg-[#155DFC1A] focus:outline-[#155DFC66]',
      hasError && 'bg-neutral-0 outline-rose-500 hover:outline-rose-500 focus:outline-rose-500',
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
