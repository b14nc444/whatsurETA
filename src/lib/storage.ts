const LAST_COURIER_KEY = 'lastCourierCode';

export const getLastCourierCode = (): string | null => {
  if (typeof window === 'undefined') return null;
  return window.sessionStorage.getItem(LAST_COURIER_KEY);
};

export const setLastCourierCode = (code: string): void => {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(LAST_COURIER_KEY, code);
};
