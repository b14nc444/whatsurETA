type EventPayload = Record<string, string | number | boolean | null | undefined>;

export const trackEvent = (name: string, payload?: EventPayload): void => {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.log('[event]', name, payload ?? {});
  }
};
