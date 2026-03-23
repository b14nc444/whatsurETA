import type {
  DeliveryApiCouriersResponse,
  DeliveryApiTraceResponse
} from '@/types/deliveryapi';

const DEFAULT_BASE_URL = 'https://api.deliveryapi.co.kr';

const getDeliveryApiEnv = () => {
  const apiKey = process.env.DELIVERY_API_KEY;
  const secretKey = process.env.DELIVERY_API_SECRET;
  const baseUrl = process.env.DELIVERY_API_BASE_URL ?? DEFAULT_BASE_URL;

  if (!apiKey || !secretKey) {
    throw new Error('DELIVERY_API_KEY and DELIVERY_API_SECRET are required');
  }

  return {
    baseUrl,
    authHeader: `Bearer ${apiKey}:${secretKey}`
  };
};

const requestWithTimeout = async (url: string, init: RequestInit, timeoutMs = 8000) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal
    });
  } finally {
    clearTimeout(timeout);
  }
};

export const getDeliveryApiCouriers = async (): Promise<DeliveryApiCouriersResponse> => {
  const { baseUrl, authHeader } = getDeliveryApiEnv();
  const response = await requestWithTimeout(`${baseUrl}/v1/tracking/couriers`, {
    method: 'GET',
    headers: {
      Authorization: authHeader
    },
    cache: 'no-store'
  });

  return (await response.json()) as DeliveryApiCouriersResponse;
};

export const traceDeliveryApiTracking = async (
  courierCode: string,
  trackingNumber: string
): Promise<DeliveryApiTraceResponse> => {
  const { baseUrl, authHeader } = getDeliveryApiEnv();
  const response = await requestWithTimeout(`${baseUrl}/v1/tracking/trace`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader
    },
    body: JSON.stringify({
      items: [
        {
          courierCode,
          trackingNumber
        }
      ]
    }),
    cache: 'no-store'
  });

  return (await response.json()) as DeliveryApiTraceResponse;
};
