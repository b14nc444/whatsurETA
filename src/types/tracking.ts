export type DeliveryStatus =
  | 'PENDING'
  | 'REGISTERED'
  | 'PICKUP_READY'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'FAILED'
  | 'RETURNED'
  | 'CANCELLED'
  | 'HOLD'
  | 'UNKNOWN';

export type Progress = {
  dateTime: string;
  location: string | null;
  status: string;
  statusCode: DeliveryStatus;
  description: string | null;
};

export type Tracking = {
  courierCode: string;
  courierName: string;
  trackingNumberMasked: string;
  deliveryStatus: DeliveryStatus;
  deliveryStatusText: string;
  isDelivered: boolean;
  lastProgressAt: string | null;
  lastLocation: string | null;
  progresses: Progress[];
};
