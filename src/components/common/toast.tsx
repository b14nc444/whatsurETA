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
  success: 'bg-green-700/10 outline-green-700/40 text-green-700',
  error: 'bg-rose-500/10 outline-rose-500/40 text-rose-500'
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
        'pointer-events-none fixed left-1/2 top-3 z-50 inline-flex w-[min(92vw,24rem)] -translate-x-1/2 items-start justify-start transition-all duration-base ease-standard',
        open ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
      )}
    >
      <div
        className={cn(
          "inline-flex flex-1 flex-col items-start justify-start gap-1.5 overflow-hidden rounded-2xl p-5 outline outline-1 outline-offset-[-1px]",
          toneClass[type]
        )}
      >
        <div className="w-full text-base font-bold leading-7">{message}</div>
      </div>
    </div>
  );
};
