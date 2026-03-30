import type { Courier } from '@/types/courier';

const KOREAN_COURIER_CODE_ALLOWLIST = new Set([
  'cj',
  'lotte',
  'hanjin',
  'post',
  'epost',
  'logen',
  'kyungdong',
  'daesin',
  'hapdong',
  'coupang',
  'woori',
  'ilyang'
]);

const KOREAN_COURIER_NAME_KEYWORDS = [
  '대한통운',
  '롯데',
  '한진',
  '우체국',
  '로젠',
  '경동',
  '대신',
  '합동',
  '쿠팡',
  '우리택배',
  '일양'
];

const normalize = (value: string) => value.trim().toLowerCase();

export const isKoreanCourier = (courier: Courier): boolean => {
  const code = normalize(courier.code);
  const name = courier.name.trim();

  if (KOREAN_COURIER_CODE_ALLOWLIST.has(code)) {
    return true;
  }

  return KOREAN_COURIER_NAME_KEYWORDS.some((keyword) => name.includes(keyword));
};

const isCourierShape = (value: unknown): value is { code: string; name: string; enabled?: boolean } => {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  return typeof record.code === 'string' && typeof record.name === 'string';
};

export const sanitizeAndFilterKoreanCouriers = (value: unknown): Courier[] => {
  if (!Array.isArray(value)) return [];

  const deduped = new Map<string, Courier>();
  for (const item of value) {
    if (!isCourierShape(item)) continue;
    const code = normalize(item.code);
    if (!code) continue;

    deduped.set(code, {
      code,
      name: item.name.trim(),
      enabled: item.enabled ?? true
    });
  }

  return [...deduped.values()].filter(isKoreanCourier);
};
