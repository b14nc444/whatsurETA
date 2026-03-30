'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';

type Props = {
  startedAt?: number;
};

export const LoadingState = ({ startedAt }: Props) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const begin = startedAt ?? Date.now();
    const timer = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - begin) / 1000));
    }, 500);
    return () => window.clearInterval(timer);
  }, [startedAt]);

  return (
    <Card className="space-y-2 text-sm text-slate-700" aria-live="polite">
      <p className="font-semibold">배송 정보를 확인하고 있어요</p>
      <p>도착 예상 시간을 계산하고 있어요</p>
      {elapsed > 3 && <p className="text-amber-700">조회가 조금 지연되고 있어요.</p>}
      {elapsed > 8 && <p className="text-amber-700">잠시 후 자동으로 결과를 불러오거나, 다시 시도해주세요.</p>}
      {elapsed > 20 && <p className="text-red-700">일시적 오류가 발생했어요. 잠시 후 재시도해주세요.</p>}
    </Card>
  );
};
