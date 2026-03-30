import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type Props = {
  title?: string;
  message: string;
};

export const ErrorState = ({ title = '오류가 발생했어요', message }: Props) => (
  <Card className="space-y-3 text-sm">
    <h2 className="text-base font-semibold text-red-700">{title}</h2>
    <p className="text-slate-700">{message}</p>
    <Button asChild variant="secondary">
      <Link href="/">홈으로 이동</Link>
    </Button>
  </Card>
);
