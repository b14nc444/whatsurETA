'use client';

import { useMemo, useState } from 'react';
import type { Progress } from '@/types/tracking';
import { formatDateTimeKo } from '@/lib/formatter';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

type Props = {
  progresses: Progress[];
};

export const ProgressTable = ({ progresses }: Props) => {
  const [olderExpanded, setOlderExpanded] = useState(false);
  const sorted = useMemo(
    () => [...progresses].sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()),
    [progresses]
  );

  const rowEntries = useMemo(
    () => sorted.map((row, index) => ({ row, index })),
    [sorted]
  );

  const shouldCollapseOlder = sorted.length > 4;
  const olderEntries = shouldCollapseOlder ? rowEntries.slice(0, -3) : [];
  const recentEntries = shouldCollapseOlder ? rowEntries.slice(-3) : rowEntries;
  const latestIndex = sorted.length - 1;

  if (!sorted.length) {
    return <Card preset="content" className="text-body-sm text-neutral-700">진행 이력이 아직 없어요.</Card>;
  }

  const renderRows = (entries: Array<{ row: Progress; index: number }>, fadedTop = false) =>
    entries.map(({ row, index }, localIndex) => {
      const isCurrent = index === latestIndex;
      const rowKey = [
        row.dateTime,
        row.statusCode,
        row.status,
        row.location ?? 'unknown',
        row.description ?? 'none',
        index
      ].join('|');

      return (
        <div key={rowKey} className="relative flex gap-4">
          <div className="relative flex w-8 justify-center">
            {fadedTop && localIndex === 0 ? (
              <span className="absolute -top-3 h-3 w-px bg-gradient-to-t from-brand-blue-100 to-neutral-0" />
            ) : null}
            <span
              className={isCurrent
                ? 'z-10 mt-1.5 h-5 w-5 rounded-full border border-brand-purple-100 bg-brand-purple-500 shadow-[0_0_0_6px_rgb(106_47_224_/_0.14)]'
                : 'z-10 mt-1.5 h-5 w-5 rounded-full border border-neutral-300 bg-neutral-0'}
            />
            {index < latestIndex ? <span className="absolute top-6 h-[calc(100%+8px)] w-px bg-brand-blue-100" /> : null}
          </div>
          <div className="pb-2">
            <Badge tone={isCurrent ? 'info' : 'default'} size="sm" emphasis="soft">
              {row.status}
            </Badge>
            <p className="mt-2 text-body-md font-semibold text-neutral-700">{row.location ?? '-'}</p>
            <p className="text-caption text-neutral-500">{formatDateTimeKo(row.dateTime)}</p>
            {row.description ? <p className="mt-1 text-caption text-neutral-500">{row.description}</p> : null}
          </div>
        </div>
      );
    });

  return (
    <Card preset="content" className="space-y-6">
      <h2 className="text-heading-h3">배송 현황</h2>
      <div className="space-y-6">
        {shouldCollapseOlder ? (
          <div className="space-y-6">
            <button
              type="button"
              className={`relative flex h-12 w-full items-center justify-center overflow-hidden rounded-lg text-body-sm font-semibold ${
                olderExpanded ? 'border-0 text-neutral-500' : 'border border-neutral-200 text-neutral-700'
              }`}
              onClick={() => setOlderExpanded((prev) => !prev)}
            >
              {!olderExpanded ? (
                <>
                  <span className="absolute inset-0 bg-gradient-to-b from-neutral-0/20 via-neutral-0/90 to-neutral-0" />
                  <span className="relative">이전 배송 이력 {olderEntries.length}개 보기</span>
                </>
              ) : (
                <span>이전 배송 이력 접기</span>
              )}
            </button>
            {olderExpanded ? <div className="space-y-6">{renderRows(olderEntries)}</div> : null}
          </div>
        ) : null}
        <div className="space-y-6">{renderRows(recentEntries, shouldCollapseOlder && !olderExpanded)}</div>
      </div>
    </Card>
  );
};
