import type { ApiErrorCode } from '@/types/api';
import type { DeliveryStatus } from '@/types/tracking';

export const ETA_HIDDEN_STATUSES: DeliveryStatus[] = [
  'DELIVERED',
  'FAILED',
  'RETURNED',
  'CANCELLED',
  'HOLD'
];

export const ERROR_MESSAGES: Record<ApiErrorCode, string> = {
  INVALID_TRACKING_NUMBER: '송장번호 형식을 다시 확인해주세요.',
  DESTINATION_REQUIRED: '도착지를 선택해주세요.',
  NOT_FOUND:
    '아직 택배사 시스템에 반영되지 않았거나 송장번호가 일치하지 않아요. 1~3시간 뒤 다시 확인해보세요.',
  SYSTEM_ERROR: '택배사 응답이 일시적으로 지연되고 있어요.',
  ETA_UNAVAILABLE: '도착 시간 예측이 어려워요.',
  RATE_LIMITED: '조회가 너무 많아요. 잠시 후 다시 시도해주세요.'
};

export const REFRESH_MINUTES_BY_STATUS: Partial<Record<DeliveryStatus, number>> = {
  PENDING: 180,
  REGISTERED: 180,
  PICKED_UP: 180,
  IN_TRANSIT: 60,
  OUT_FOR_DELIVERY: 15,
  DELIVERED: 1440
};
