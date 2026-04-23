import { NextResponse } from 'next/server';
import { fetchCouriersFromProvider } from '@/lib/delivery-service';
import { sanitizeAndFilterKoreanCouriers } from '@/lib/courier-filter';
import { getRedisClient } from '@/lib/redis';

export const runtime = 'nodejs';

const CACHE_KEY = 'couriers:list';
const CACHE_TTL_SEC = 60 * 30;
const REDIS_CONNECT_TIMEOUT_MS = 1500;
const REDIS_IO_TIMEOUT_MS = 800;
const FALLBACK_COURIERS = [
  { code: 'lotte', name: '롯데택배', enabled: true },
  { code: 'cj', name: 'CJ대한통운', enabled: true },
  { code: 'hanjin', name: '한진택배', enabled: true },
  { code: 'post', name: '우체국택배', enabled: true },
  { code: 'kyungdong', name: '경동택배', enabled: true },
  { code: 'daesin', name: '대신택배', enabled: true },
  { code: 'logen', name: '로젠택배', enabled: true },
  { code: 'hapdong', name: '합동택배', enabled: true },
  { code: 'coupang', name: '쿠팡택배', enabled: true },
  { code: 'woori', name: '우리택배', enabled: true }
];

const withTimeout = async <T>(promise: Promise<T>, timeoutMs: number): Promise<T> =>
  await Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error('TIMEOUT')), timeoutMs);
    })
  ]);

export async function GET() {
  try {
    let redis = null;
    try {
      redis = await withTimeout(getRedisClient(), REDIS_CONNECT_TIMEOUT_MS);
    } catch {
      redis = null;
    }

    if (redis) {
      try {
        const cached = await withTimeout(redis.get(CACHE_KEY), REDIS_IO_TIMEOUT_MS);
        if (cached) {
          const parsed = JSON.parse(cached) as { couriers: unknown; updatedAt: string };
          return NextResponse.json({
            couriers: sanitizeAndFilterKoreanCouriers(parsed.couriers),
            updatedAt: parsed.updatedAt
          });
        }
      } catch {
        // Redis read timeout/failure should not block courier response.
      }
    }

    const couriers = await fetchCouriersFromProvider();
    const payload = {
      couriers,
      updatedAt: new Date().toISOString()
    };
    if (redis) {
      try {
        await withTimeout(
          redis.set(CACHE_KEY, JSON.stringify(payload), {
            EX: CACHE_TTL_SEC
          }),
          REDIS_IO_TIMEOUT_MS
        );
      } catch {
        // Redis write timeout/failure should not block courier response.
      }
    }

    return NextResponse.json(payload);
  } catch {
    return NextResponse.json({
      couriers: sanitizeAndFilterKoreanCouriers(FALLBACK_COURIERS),
      updatedAt: new Date().toISOString()
    });
  }
}
