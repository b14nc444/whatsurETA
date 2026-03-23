import { createHash } from 'crypto';
import { getRedisClient } from '@/lib/redis';
import type { TrackResponse } from '@/types/api';
import type { DeliveryStatus } from '@/types/tracking';

type TraceCacheValue = {
  response: TrackResponse;
  cachedAt: string;
};

const TRACE_PREFIX = 'trace';
const ETA_PREFIX = 'eta';

const hash = (value: string): string => createHash('sha256').update(value).digest('hex').slice(0, 16);

export const maskTrackingNumber = (value: string): string => {
  if (value.length <= 6) return `${value.slice(0, 2)}****`;
  return `${value.slice(0, 4)}******${value.slice(-2)}`;
};

const ttlByStatus: Partial<Record<DeliveryStatus, number>> = {
  PENDING: 180 * 60,
  REGISTERED: 180 * 60,
  PICKUP_READY: 180 * 60,
  PICKED_UP: 180 * 60,
  IN_TRANSIT: 60 * 60,
  OUT_FOR_DELIVERY: 15 * 60,
  DELIVERED: 1440 * 60
};

const traceKey = (courierCode: string, trackingNumber: string): string =>
  `${TRACE_PREFIX}:${courierCode}:${hash(trackingNumber)}`;

const etaKey = (
  courierCode: string,
  trackingNumber: string,
  postalCode: string,
  baseAddress: string,
  latestProgressHash: string
): string =>
  `${ETA_PREFIX}:${courierCode}:${hash(trackingNumber)}:${hash(`${postalCode}|${baseAddress}`)}:${latestProgressHash}`;

export const loadTraceCache = async (
  courierCode: string,
  trackingNumber: string
): Promise<TraceCacheValue | null> => {
  const client = await getRedisClient();
  const raw = await client.get(traceKey(courierCode, trackingNumber));
  if (!raw) return null;

  try {
    return JSON.parse(raw) as TraceCacheValue;
  } catch {
    return null;
  }
};

export const saveTraceCache = async (
  courierCode: string,
  trackingNumber: string,
  response: TrackResponse
): Promise<void> => {
  const client = await getRedisClient();
  const ttl = ttlByStatus[response.tracking.deliveryStatus] ?? 60 * 60;
  const payload: TraceCacheValue = {
    response,
    cachedAt: new Date().toISOString()
  };

  await client.set(traceKey(courierCode, trackingNumber), JSON.stringify(payload), { EX: ttl });
};

export const loadEtaCache = async (
  courierCode: string,
  trackingNumber: string,
  postalCode: string,
  baseAddress: string,
  latestProgressHash: string
): Promise<TrackResponse['prediction'] | null> => {
  const client = await getRedisClient();
  const raw = await client.get(etaKey(courierCode, trackingNumber, postalCode, baseAddress, latestProgressHash));
  if (!raw) return null;

  try {
    return JSON.parse(raw) as TrackResponse['prediction'];
  } catch {
    return null;
  }
};

export const saveEtaCache = async (
  courierCode: string,
  trackingNumber: string,
  postalCode: string,
  baseAddress: string,
  latestProgressHash: string,
  prediction: TrackResponse['prediction'],
  status: DeliveryStatus
): Promise<void> => {
  const client = await getRedisClient();
  const ttl = ttlByStatus[status] ?? 60 * 60;
  await client.set(
    etaKey(courierCode, trackingNumber, postalCode, baseAddress, latestProgressHash),
    JSON.stringify(prediction),
    { EX: ttl }
  );
};

export const latestProgressHash = (
  progresses: Array<{ dateTime: string; statusCode: string; location: string | null }>
): string => {
  const latest = progresses[0];
  if (!latest) return 'no-progress';
  return hash(`${latest.dateTime}|${latest.statusCode}|${latest.location ?? '-'}`);
};
