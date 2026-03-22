import type { TrackResponse } from '@/types/api';
import type { Courier } from '@/types/courier';
import type { DeliveryStatus } from '@/types/tracking';
import { ETA_HIDDEN_STATUSES, ERROR_MESSAGES, REFRESH_MINUTES_BY_STATUS } from '@/lib/constants';

export const MOCK_COURIERS: Courier[] = [
  { code: 'cj', name: 'CJ대한통운', enabled: true },
  { code: 'lotte', name: '롯데택배', enabled: true },
  { code: 'hanjin', name: '한진택배', enabled: true },
  { code: 'epost', name: '우체국택배', enabled: true }
];

const statusTextMap: Record<DeliveryStatus, string> = {
  PENDING: '접수대기',
  REGISTERED: '접수완료',
  PICKUP_READY: '집하준비',
  PICKED_UP: '집하완료',
  IN_TRANSIT: '배송중',
  OUT_FOR_DELIVERY: '배송출발',
  DELIVERED: '배송완료',
  FAILED: '배송실패',
  RETURNED: '반송',
  CANCELLED: '취소',
  HOLD: '보류',
  UNKNOWN: '확인중'
};

const toIsoInKst = (date: Date): string => {
  const local = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const base = local.toISOString().replace('Z', '+09:00');
  return base;
};

const maskTracking = (value: string): string => {
  if (value.length <= 6) return `${value.slice(0, 2)}****`;
  return `${value.slice(0, 4)}******${value.slice(-2)}`;
};

export const buildMockTrackResponse = (params: {
  queryId: string;
  courierCode: string;
  courierName: string;
  trackingNumber: string;
  destinationBaseAddress: string;
  destinationPostalCode: string;
}): TrackResponse => {
  const { queryId, courierCode, courierName, trackingNumber, destinationBaseAddress } = params;
  const now = new Date();

  const delivered = trackingNumber.endsWith('99');
  const failed = trackingNumber.endsWith('88');
  const notFound = trackingNumber.endsWith('00');
  if (notFound) {
    throw {
      error: {
        code: 'NOT_FOUND',
        message: ERROR_MESSAGES.NOT_FOUND
      }
    };
  }

  const status: DeliveryStatus = delivered ? 'DELIVERED' : failed ? 'FAILED' : 'IN_TRANSIT';
  const refreshMin = REFRESH_MINUTES_BY_STATUS[status] ?? 60;

  const progresses = [
    {
      dateTime: toIsoInKst(new Date(now.getTime() - 1000 * 60 * 130)),
      location: '서울 중구',
      status: '간선하차',
      statusCode: 'IN_TRANSIT' as const,
      description: '허브 도착'
    },
    {
      dateTime: toIsoInKst(new Date(now.getTime() - 1000 * 60 * 50)),
      location: '서울 강남구',
      status: statusTextMap[status],
      statusCode: status,
      description: delivered ? '배송 완료' : failed ? '수취인 부재' : '배송중'
    }
  ];

  const etaBlocked = ETA_HIDDEN_STATUSES.includes(status);
  const earliest = toIsoInKst(new Date(now.getTime() + 1000 * 60 * 120));
  const latest = toIsoInKst(new Date(now.getTime() + 1000 * 60 * 300));

  return {
    queryId,
    dataSource: trackingNumber.endsWith('11') ? 'cache' : 'live',
    isStale: trackingNumber.endsWith('77'),
    tracking: {
      courierCode,
      courierName,
      trackingNumberMasked: maskTracking(trackingNumber),
      deliveryStatus: status,
      deliveryStatusText: statusTextMap[status],
      isDelivered: status === 'DELIVERED',
      lastProgressAt: progresses[0]?.dateTime ?? null,
      lastLocation: progresses[0]?.location ?? null,
      progresses
    },
    prediction: {
      earliestEta: etaBlocked ? null : earliest,
      latestEta: etaBlocked ? null : latest,
      reason: etaBlocked
        ? '도착 시간 예측이 어려워요.'
        : `최근 배송 이력이 확인되어 ${destinationBaseAddress} 기준 오늘 도착 가능성이 높습니다.`,
      source: etaBlocked ? 'fallback' : 'gpt',
      fallback: etaBlocked
    },
    meta: {
      queriedAt: toIsoInKst(now),
      recommendedRefreshAfterMin: refreshMin
    }
  };
};
