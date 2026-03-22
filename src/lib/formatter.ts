const KOREA_TIMEZONE = 'Asia/Seoul';

export const formatDateTimeKo = (iso: string | null): string => {
  if (!iso) return '-';
  const date = new Date(iso);
  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: KOREA_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const formatEtaLabel = (iso: string | null): string => {
  if (!iso) return '예측 불가';
  const date = new Date(iso);
  const now = new Date();

  const etaDate = new Intl.DateTimeFormat('en-CA', {
    timeZone: KOREA_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
  const nowDate = new Intl.DateTimeFormat('en-CA', {
    timeZone: KOREA_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(now);

  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const tomorrowDate = new Intl.DateTimeFormat('en-CA', {
    timeZone: KOREA_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(tomorrow);

  const hour = new Intl.DateTimeFormat('ko-KR', {
    timeZone: KOREA_TIMEZONE,
    hour: 'numeric',
    hour12: false
  }).format(date);

  if (etaDate === nowDate) return `오늘 ${hour}시`;
  if (etaDate === tomorrowDate) return `내일 ${hour}시`;

  const monthDay = new Intl.DateTimeFormat('ko-KR', {
    timeZone: KOREA_TIMEZONE,
    month: 'numeric',
    day: 'numeric'
  }).format(date);

  return `${monthDay} ${hour}시`;
};
