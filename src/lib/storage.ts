const LAST_COURIER_KEY = 'lastCourierCode';
const LAST_DESTINATION_KEY = 'lastDestination';

type StoredDestination = {
  postalCode: string;
  baseAddress: string;
};

export const getLastCourierCode = (): string | null => {
  if (typeof window === 'undefined') return null;
  return window.sessionStorage.getItem(LAST_COURIER_KEY);
};

export const setLastCourierCode = (code: string): void => {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(LAST_COURIER_KEY, code);
};

export const getLastDestination = (): StoredDestination | null => {
  if (typeof window === 'undefined') return null;

  const raw = window.sessionStorage.getItem(LAST_DESTINATION_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<StoredDestination>;
    if (typeof parsed.postalCode !== 'string' || typeof parsed.baseAddress !== 'string') {
      return null;
    }

    return {
      postalCode: parsed.postalCode,
      baseAddress: parsed.baseAddress
    };
  } catch {
    return null;
  }
};

export const setLastDestination = (destination: StoredDestination): void => {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(LAST_DESTINATION_KEY, JSON.stringify(destination));
};
