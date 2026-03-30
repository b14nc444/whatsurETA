import { randomUUID, createHash } from 'crypto';
import { ERROR_MESSAGES, ETA_HIDDEN_STATUSES, REFRESH_MINUTES_BY_STATUS } from '@/lib/constants';
import { getDeliveryApiCouriers, traceDeliveryApiTracking } from '@/lib/deliveryapi-client';
import { sanitizeAndFilterKoreanCouriers } from '@/lib/courier-filter';
import { generateEtaPrediction } from '@/lib/eta-service';
import {
  latestProgressHash,
  loadEtaCache,
  loadTraceCache,
  maskTrackingNumber,
  saveEtaCache,
  saveTraceCache
} from '@/lib/tracking-cache';
import type { ApiErrorCode, TrackResponse } from '@/types/api';
import type {
  DeliveryApiCourier,
  DeliveryApiTraceItem,
  DeliveryApiTraceItemData
} from '@/types/deliveryapi';
import type { Courier } from '@/types/courier';
import type { DeliveryStatus, Progress } from '@/types/tracking';

const KST_OFFSET = '+09:00';

const parseDateToIso = (value: string | null | undefined): string | null => {
  if (!value) return null;
  if (value.includes('T')) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return date.toISOString().replace('Z', KST_OFFSET);
  }

  // deliveryapi date format: yyyy-MM-dd HH:mm[:ss]
  const normalized = value.replace(' ', 'T');
  const withSec = normalized.length === 16 ? `${normalized}:00` : normalized;
  const date = new Date(`${withSec}${KST_OFFSET}`);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().replace('Z', KST_OFFSET);
};

const normalizeStatus = (status?: string | null): DeliveryStatus => {
  const upper = (status ?? '').toUpperCase();
  const allowed: DeliveryStatus[] = [
    'PENDING',
    'REGISTERED',
    'PICKUP_READY',
    'PICKED_UP',
    'IN_TRANSIT',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'FAILED',
    'RETURNED',
    'CANCELLED',
    'HOLD',
    'UNKNOWN'
  ];

  return allowed.includes(upper as DeliveryStatus) ? (upper as DeliveryStatus) : 'UNKNOWN';
};

const toCouriers = (items: DeliveryApiCourier[]): Courier[] =>
  sanitizeAndFilterKoreanCouriers(
    items.map((item) => ({
      code: item.trackingApiCode,
      name: item.displayName,
      enabled: true
    }))
  );

const mapTraceErrorCode = (code?: string): ApiErrorCode => {
  const upper = (code ?? '').toUpperCase();
  if (upper === 'INVALID_TRACKING_NUMBER') return 'INVALID_TRACKING_NUMBER';
  if (upper === 'NOT_FOUND') return 'NOT_FOUND';
  return 'SYSTEM_ERROR';
};

const buildProgresses = (data: DeliveryApiTraceItemData): Progress[] => {
  const progresses = data.progresses ?? [];
  return progresses
    .map((item) => {
      const dateTime = parseDateToIso(item.dateTime);
      if (!dateTime) return null;

      return {
        dateTime,
        location: item.location ?? null,
        status: item.status ?? '-',
        statusCode: normalizeStatus(item.statusCode),
        description: item.description ?? null
      };
    })
    .filter((item): item is Progress => Boolean(item))
    .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
};

const buildTracking = (
  courierCode: string,
  trackingNumber: string,
  data: DeliveryApiTraceItemData
): TrackResponse['tracking'] => {
  const deliveryStatus = normalizeStatus(data.deliveryStatus);
  const progresses = buildProgresses(data);
  const lastProgressAt = parseDateToIso(data.dateLastProgress) ?? progresses[0]?.dateTime ?? null;
  const lastLocation = progresses[0]?.location ?? null;

  return {
    courierCode,
    courierName: data.courierName,
    trackingNumberMasked: maskTrackingNumber(trackingNumber),
    deliveryStatus,
    deliveryStatusText: data.deliveryStatusText ?? deliveryStatus,
    isDelivered: Boolean(data.isDelivered ?? deliveryStatus === 'DELIVERED'),
    lastProgressAt,
    lastLocation,
    progresses
  };
};

const defaultPrediction = (): TrackResponse['prediction'] => ({
  earliestEta: null,
  latestEta: null,
  reason: '도착 시간 예측이 어려워요.',
  source: 'fallback',
  fallback: true
});

const makeError = (code: ApiErrorCode) => ({
  code,
  message: ERROR_MESSAGES[code]
});

const getFirstResult = (results?: DeliveryApiTraceItem[]): DeliveryApiTraceItem | null =>
  results && results.length > 0 ? results[0] : null;

export const fetchCouriersFromProvider = async (): Promise<Courier[]> => {
  const response = await getDeliveryApiCouriers();
  const couriers = response.data?.couriers ?? [];
  return toCouriers(couriers);
};

export const trackParcel = async (params: {
  courierCode: string;
  trackingNumber: string;
  postalCode: string;
  baseAddress: string;
}): Promise<{ data?: TrackResponse; error?: { code: ApiErrorCode; message: string } }> => {
  const { courierCode, trackingNumber, postalCode, baseAddress } = params;

  const traceCache = await loadTraceCache(courierCode, trackingNumber);
  if (traceCache) {
    const cached = traceCache.response;
    cached.dataSource = 'cache';
    return { data: cached };
  }

  const traceResponse = await traceDeliveryApiTracking(courierCode, trackingNumber);
  const result = getFirstResult(traceResponse.data?.results);

  if (!traceResponse.isSuccess) {
    return { error: makeError('SYSTEM_ERROR') };
  }

  if (!result) {
    return { error: makeError('NOT_FOUND') };
  }

  if (!result.success || !result.data) {
    const mapped = mapTraceErrorCode(result.error?.code);
    return { error: makeError(mapped) };
  }

  const tracking = buildTracking(courierCode, trackingNumber, result.data);
  const baseResponse: TrackResponse = {
    queryId: `q_${randomUUID().slice(0, 12)}`,
    dataSource: result.cache?.fromCache ? 'cache' : 'live',
    isStale: false,
    tracking,
    prediction: defaultPrediction(),
    meta: {
      queriedAt: parseDateToIso(result.data.queriedAt) ?? new Date().toISOString().replace('Z', KST_OFFSET),
      recommendedRefreshAfterMin: REFRESH_MINUTES_BY_STATUS[tracking.deliveryStatus] ?? 60
    }
  };

  if (!ETA_HIDDEN_STATUSES.includes(tracking.deliveryStatus)) {
    const progressHash = latestProgressHash(tracking.progresses);
    const etaCache = await loadEtaCache(
      courierCode,
      trackingNumber,
      postalCode,
      baseAddress,
      progressHash
    );

    if (etaCache) {
      baseResponse.prediction = etaCache;
    } else {
      try {
        const predicted = await generateEtaPrediction({
          courierName: tracking.courierName,
          deliveryStatus: tracking.deliveryStatus,
          deliveryStatusText: tracking.deliveryStatusText,
          lastProgressAt: tracking.lastProgressAt,
          lastLocation: tracking.lastLocation,
          progresses: tracking.progresses,
          postalCode,
          baseAddress
        });
        baseResponse.prediction = predicted;

        await saveEtaCache(
          courierCode,
          trackingNumber,
          postalCode,
          baseAddress,
          progressHash,
          predicted,
          tracking.deliveryStatus
        );
      } catch {
        baseResponse.prediction = defaultPrediction();
      }
    }
  }

  await saveTraceCache(courierCode, trackingNumber, baseResponse);
  return { data: baseResponse };
};

export const destinationHash = (postalCode: string, baseAddress: string): string =>
  createHash('sha256').update(`${postalCode}|${baseAddress}`).digest('hex').slice(0, 16);
