import { NextRequest, NextResponse } from 'next/server';
import { ERROR_MESSAGES } from '@/lib/constants';
import { trackParcel } from '@/lib/delivery-service';
import { checkRateLimit } from '@/lib/rate-limit';
import { setResult } from '@/lib/result-store';
import { isDestinationValid, isTrackingNumberValid, sanitizeTrackingNumber } from '@/lib/validators';
import type { ApiErrorCode } from '@/types/api';

export const runtime = 'nodejs';

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

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local';
  let allowed = false;
  try {
    allowed = await checkRateLimit(ip);
  } catch {
    return buildError('SYSTEM_ERROR', 500);
  }
  if (!allowed) {
    return buildError('RATE_LIMITED', 429);
  }

  const body = (await request.json()) as {
    courierCode?: string;
    trackingNumber?: string;
    destination?: { postalCode?: string; baseAddress?: string };
  };

  const courierCode = body.courierCode?.trim();
  if (!courierCode) {
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
    const tracked = await trackParcel({
      courierCode,
      trackingNumber: sanitized,
      postalCode,
      baseAddress
    });
    if (tracked.error) {
      const status =
        tracked.error.code === 'NOT_FOUND'
          ? 404
          : tracked.error.code === 'SYSTEM_ERROR'
            ? 500
            : 400;
      return buildError(tracked.error.code, status);
    }

    if (!tracked.data) {
      return buildError('SYSTEM_ERROR', 500);
    }

    await setResult(tracked.data.queryId, tracked.data);
    return NextResponse.json(tracked.data);
  } catch {
    return buildError('SYSTEM_ERROR', 500);
  }
}
