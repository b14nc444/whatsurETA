export const sanitizeTrackingNumber = (value: string): string =>
  value.replace(/[\s-]/g, '').trim();

export const isTrackingNumberValid = (value: string): boolean => {
  const sanitized = sanitizeTrackingNumber(value);
  if (!/^[A-Za-z0-9]+$/.test(sanitized)) {
    return false;
  }
  return sanitized.length >= 8 && sanitized.length <= 20;
};

export const isDestinationValid = (postalCode?: string, baseAddress?: string): boolean =>
  Boolean(postalCode && baseAddress);
