'use client';

import { useEffect } from 'react';
import { cn } from '@/lib/cn';

type ToastType = 'success' | 'error';

type Props = {
  open: boolean;
  type?: ToastType;
  message: string;
  onClose: () => void;
  durationMs?: number;
};

const toneClass: Record<ToastType, string> = {
  success: 'border-state-success-100 bg-state-success-50 text-state-success-700',
  error: 'border-state-error-100 bg-state-error-50 text-state-error-700'
};

export const Toast = ({
  open,
  type = 'success',
  message,
  onClose,
  durationMs = 2200
}: Props) => {
  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(onClose, durationMs);
    return () => window.clearTimeout(timer);
  }, [open, onClose, durationMs]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'pointer-events-none fixed left-1/2 top-6 z-50 w-[min(92vw,420px)] -translate-x-1/2 rounded-md border px-4 py-3 text-body-sm font-semibold shadow-token-md transition-all duration-base ease-standard',
        toneClass[type],
        open ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
      )}
    >
      {message}
    </div>
  );
};
