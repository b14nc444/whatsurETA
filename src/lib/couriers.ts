import type { Courier } from '@/types/courier';

export const SUPPORTED_COURIERS: Courier[] = [
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

