import type { TrackResponse } from '@/types/api';
import { getRedisClient } from '@/lib/redis';

const TTL_SEC = 24 * 60 * 60;
const KEY_PREFIX = 'result';
const keyOf = (queryId: string) => `${KEY_PREFIX}:${queryId}`;

export const setResult = async (queryId: string, data: TrackResponse): Promise<void> => {
  const client = await getRedisClient();
  await client.set(keyOf(queryId), JSON.stringify(data), {
    EX: TTL_SEC
  });
};

export const getResultById = async (queryId: string): Promise<TrackResponse | null> => {
  const client = await getRedisClient();
  const raw = await client.get(keyOf(queryId));
  if (!raw) return null;

  try {
    return JSON.parse(raw) as TrackResponse;
  } catch {
    await client.del(keyOf(queryId));
    return null;
  }
};
