import type { ApiError, TrackRequest, TrackResponse } from '@/types/api';
import type { CouriersResponse } from '@/types/courier';

const ensureJson = async <T>(response: Response): Promise<T> => {
  const data = (await response.json()) as T | ApiError;
  if (!response.ok) {
    throw data;
  }
  return data as T;
};

export const getCouriers = async (): Promise<CouriersResponse> =>
  ensureJson<CouriersResponse>(await fetch('/api/v1/couriers', { cache: 'no-store' }));

export const postTrack = async (payload: TrackRequest): Promise<TrackResponse> =>
  ensureJson<TrackResponse>(
    await fetch('/api/v1/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
  );

export const getResult = async (queryId: string): Promise<TrackResponse> =>
  ensureJson<TrackResponse>(await fetch(`/api/v1/results/${queryId}`, { cache: 'no-store' }));
