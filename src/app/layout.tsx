import type { Metadata } from 'next';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: '언제올까? - 택배 ETA 조회',
  description: '택배사, 송장번호, 도착지로 도착 예상 시간을 조회합니다.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
