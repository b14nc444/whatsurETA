const LAST_COURIER_KEY = 'lastCourierCode';
const LAST_TRACKING_NUMBER_KEY = 'lastTrackingNumber';
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
  if (!code) {
    window.sessionStorage.removeItem(LAST_COURIER_KEY);
    return;
  }
  window.sessionStorage.setItem(LAST_COURIER_KEY, code);
};

export const getLastTrackingNumber = (): string => {
  if (typeof window === 'undefined') return '';
  return window.sessionStorage.getItem(LAST_TRACKING_NUMBER_KEY) ?? '';
};

export const setLastTrackingNumber = (trackingNumber: string): void => {
  if (typeof window === 'undefined') return;
  if (!trackingNumber) {
    window.sessionStorage.removeItem(LAST_TRACKING_NUMBER_KEY);
    return;
  }
  window.sessionStorage.setItem(LAST_TRACKING_NUMBER_KEY, trackingNumber);
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
