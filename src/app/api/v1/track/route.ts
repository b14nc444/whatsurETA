import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { buildMockTrackResponse, MOCK_COURIERS } from '@/lib/mock-data';
import { ERROR_MESSAGES } from '@/lib/constants';
import { setResult } from '@/lib/result-store';
import { isDestinationValid, isTrackingNumberValid, sanitizeTrackingNumber } from '@/lib/validators';
import type { ApiErrorCode } from '@/types/api';

const requestLog = new Map<string, number[]>();
const MAX_REQUESTS_PER_MIN = 20;

const buildError = (code: ApiErrorCode, status: number) =>
  NextResponse.json(
    {
      error: {
        code,
        message: ERROR_MESSAGES[code]
      }
    },
    { status }
  );

const checkRateLimit = (key: string): boolean => {
  const now = Date.now();
  const before = requestLog.get(key) ?? [];
  const recent = before.filter((time) => now - time <= 60_000);
  if (recent.length >= MAX_REQUESTS_PER_MIN) {
    requestLog.set(key, recent);
    return false;
  }
  recent.push(now);
  requestLog.set(key, recent);
  return true;
};

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local';
  if (!checkRateLimit(ip)) {
    return buildError('RATE_LIMITED', 429);
  }

  const body = (await request.json()) as {
    courierCode?: string;
    trackingNumber?: string;
    destination?: { postalCode?: string; baseAddress?: string; detailAddress?: string };
  };

  const courier = MOCK_COURIERS.find((item) => item.code === body.courierCode);
  if (!courier) {
    return buildError('SYSTEM_ERROR', 400);
  }

  const sanitized = sanitizeTrackingNumber(body.trackingNumber ?? '');
  if (!isTrackingNumberValid(sanitized)) {
    return buildError('INVALID_TRACKING_NUMBER', 400);
  }

  const postalCode = body.destination?.postalCode ?? '';
  const baseAddress = body.destination?.baseAddress ?? '';
  if (!isDestinationValid(postalCode, baseAddress)) {
    return buildError('DESTINATION_REQUIRED', 400);
  }

  try {
    const queryId = `q_${randomUUID().slice(0, 12)}`;
    const response = buildMockTrackResponse({
      queryId,
      courierCode: courier.code,
      courierName: courier.name,
      trackingNumber: sanitized,
      destinationBaseAddress: baseAddress,
      destinationPostalCode: postalCode
    });

    setResult(queryId, response);
    return NextResponse.json(response);
  } catch {
    return buildError('NOT_FOUND', 404);
  }
}
