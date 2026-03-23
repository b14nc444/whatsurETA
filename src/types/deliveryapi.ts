export type DeliveryApiCourier = {
  trackingApiCode: string;
  displayName: string;
};

export type DeliveryApiCouriersResponse = {
  isSuccess: boolean;
  data?: {
    couriers?: DeliveryApiCourier[];
    total?: number;
  };
  errorCode?: string;
  message?: string;
};

export type DeliveryApiProgress = {
  dateTime: string;
  location?: string | null;
  status?: string | null;
  statusCode?: string | null;
  description?: string | null;
};

export type DeliveryApiTraceItemData = {
  trackingNumber: string;
  courierCode: string;
  courierName: string;
  deliveryStatus?: string | null;
  deliveryStatusText?: string | null;
  isDelivered?: boolean | null;
  dateLastProgress?: string | null;
  progresses?: DeliveryApiProgress[] | null;
  queriedAt?: string | null;
};

export type DeliveryApiTraceItemError = {
  code: string;
  message: string;
  courierCode?: string;
  trackingNumber?: string;
  billable?: boolean;
};

export type DeliveryApiTraceItem = {
  clientId?: string;
  success: boolean;
  data?: DeliveryApiTraceItemData;
  error?: DeliveryApiTraceItemError;
  cache?: {
    fromCache?: boolean;
    cachedAt?: string;
  };
};

export type DeliveryApiTraceResponse = {
  isSuccess: boolean;
  data?: {
    results?: DeliveryApiTraceItem[];
    summary?: {
      total: number;
      successful: number;
      failed: number;
      billable: number;
    };
  };
  errorCode?: string;
  message?: string;
};
