import type { TrackResponse } from '@/types/api';

const resultStore = new Map<string, { data: TrackResponse; createdAt: number }>();
const TTL_MS = 24 * 60 * 60 * 1000;

export const setResult = (queryId: string, data: TrackResponse): void => {
  resultStore.set(queryId, { data, createdAt: Date.now() });
};

export const getResultById = (queryId: string): TrackResponse | null => {
  const entry = resultStore.get(queryId);
  if (!entry) return null;
  if (Date.now() - entry.createdAt > TTL_MS) {
    resultStore.delete(queryId);
    return null;
  }
  return entry.data;
};
