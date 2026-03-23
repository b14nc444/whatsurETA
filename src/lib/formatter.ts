const KOREA_TIMEZONE = 'Asia/Seoul';
const DAY_MS = 24 * 60 * 60 * 1000;

const formatDateKey = (date: Date): string =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: KOREA_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);

const addDays = (date: Date, days: number): Date => new Date(date.getTime() + DAY_MS * days);

const extractHourNumber = (date: Date): number => {
  const raw = new Intl.DateTimeFormat('ko-KR', {
    timeZone: KOREA_TIMEZONE,
    hour: 'numeric',
    hour12: false
  }).format(date);

  const matched = raw.match(/\d+/);
  return matched ? Number(matched[0]) : date.getHours();
};

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
  const etaDate = formatDateKey(date);
  const nowDate = formatDateKey(now);
  const tomorrowDate = formatDateKey(addDays(now, 1));
  const dayAfterTomorrowDate = formatDateKey(addDays(now, 2));
  const threeDaysLaterDate = formatDateKey(addDays(now, 3));
  const hour = extractHourNumber(date);

  if (etaDate === nowDate) return `오늘 ${hour}시`;
  if (etaDate === tomorrowDate) return `내일 ${hour}시`;
  if (etaDate === dayAfterTomorrowDate) return `모레 ${hour}시`;
  if (etaDate === threeDaysLaterDate) return `글피 ${hour}시`;

  const monthDay = new Intl.DateTimeFormat('ko-KR', {
    timeZone: KOREA_TIMEZONE,
    month: 'numeric',
    day: 'numeric'
  }).format(date);

  return `${monthDay} ${hour}시`;
};
