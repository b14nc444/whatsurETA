import type { ApiError, TrackRequest, TrackResponse } from '@/types/api';
import type { CouriersResponse } from '@/types/courier';

const DEFAULT_TIMEOUT_MS = 8000;

const fetchWithTimeout = async (
  input: RequestInfo | URL,
  init?: RequestInit,
  timeoutMs = DEFAULT_TIMEOUT_MS
): Promise<Response> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal
    });
  } finally {
    clearTimeout(timeout);
  }
};

const ensureJson = async <T>(response: Response): Promise<T> => {
  const data = (await response.json()) as T | ApiError;
  if (!response.ok) {
    throw data;
  }
  return data as T;
};

export const getCouriers = async (): Promise<CouriersResponse> =>
  ensureJson<CouriersResponse>(await fetchWithTimeout('/api/v1/couriers', { cache: 'no-store' }));

export const postTrack = async (payload: TrackRequest): Promise<TrackResponse> =>
  ensureJson<TrackResponse>(
    await fetchWithTimeout('/api/v1/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
  );

export const getResult = async (queryId: string): Promise<TrackResponse> =>
  ensureJson<TrackResponse>(
    await fetchWithTimeout(`/api/v1/results/${queryId}`, { cache: 'no-store' })
  );
