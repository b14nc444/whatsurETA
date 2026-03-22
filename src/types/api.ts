import type { Prediction } from '@/types/prediction';
import type { Tracking } from '@/types/tracking';

export type ApiErrorCode =
  | 'INVALID_TRACKING_NUMBER'
  | 'DESTINATION_REQUIRED'
  | 'NOT_FOUND'
  | 'SYSTEM_ERROR'
  | 'ETA_UNAVAILABLE'
  | 'RATE_LIMITED';

export type ApiError = {
  error: {
    code: ApiErrorCode;
    message: string;
  };
};

export type TrackRequest = {
  courierCode: string;
  trackingNumber: string;
  destination: {
    postalCode: string;
    baseAddress: string;
    detailAddress?: string;
  };
};

export type TrackResponse = {
  queryId: string;
  dataSource: 'live' | 'cache';
  isStale: boolean;
  tracking: Tracking;
  prediction: Prediction;
  meta: {
    queriedAt: string;
    recommendedRefreshAfterMin: number;
  };
};
