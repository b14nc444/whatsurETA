'use client';

import { useMemo, useState } from 'react';
import type { Progress } from '@/types/tracking';
import { formatDateTimeKo } from '@/lib/formatter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type Props = {
  progresses: Progress[];
};

export const ProgressTable = ({ progresses }: Props) => {
  const [expanded, setExpanded] = useState(false);

  const sorted = useMemo(
    () => [...progresses].sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()),
    [progresses]
  );

  const items = expanded ? sorted : sorted.slice(0, 8);

  if (!sorted.length) {
    return <Card className="text-sm text-slate-600">진행 이력이 아직 없어요.</Card>;
  }

  return (
    <Card className="space-y-3">
      <h2 className="text-base font-semibold">배달 현황</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="py-2">시간</th>
              <th className="py-2">위치</th>
              <th className="py-2">상태</th>
              <th className="py-2">상세설명</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr key={`${row.dateTime}-${row.status}`} className="border-t border-slate-200">
                <td className="py-2">{formatDateTimeKo(row.dateTime)}</td>
                <td className="py-2">{row.location ?? '-'}</td>
                <td className="py-2">{row.status}</td>
                <td className="py-2">{row.description ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {sorted.length > 8 ? (
        <Button variant="secondary" onClick={() => setExpanded((prev) => !prev)}>
          {expanded ? '접기' : '더보기'}
        </Button>
      ) : null}
    </Card>
  );
};
