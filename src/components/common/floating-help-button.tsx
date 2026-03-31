'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';

const faqItems = [
  '도착지는 ETA 계산에 필요해요.',
  '송장번호 형식이 틀리면 조회가 차단돼요.',
  '예측 실패 시 배송 현황은 그대로 확인할 수 있어요.'
];

export const FloatingHelpButton = () => {
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);
  const open = useMemo(() => hovered || pinned, [hovered, pinned]);

  return (
    <div
      className="fixed bottom-6 right-6 z-40 flex flex-col items-end"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {open ? (
        <Card
          preset="content"
          className="mb-3 w-[min(92vw,360px)] rounded-xl border border-neutral-200 bg-neutral-0 p-5 shadow-token-md"
        >
          <h3 className="text-body-md font-semibold text-neutral-900">자주 묻는 질문</h3>
          <ul className="mt-3 space-y-3 text-body-sm text-neutral-700">
            {faqItems.map((item) => (
              <li
                key={item}
                className="relative pl-4 before:absolute before:left-0 before:top-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-brand-blue-500"
              >
                {item}
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
      <button
        type="button"
        aria-label="자주 묻는 질문 열기"
        aria-expanded={open}
        onClick={() => setPinned((prev) => !prev)}
        className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[image:var(--gradient-brand)] text-neutral-0 shadow-token-md transition-transform duration-base ease-standard hover:scale-105 active:scale-95"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
          <path
            d="M9.4 9.3A2.6 2.6 0 0 1 12 7.3c1.45 0 2.6.98 2.6 2.35 0 1.06-.58 1.72-1.62 2.35-.83.49-1.14.83-1.14 1.56v.22"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <circle cx="12" cy="16.9" r="1.1" fill="currentColor" />
        </svg>
      </button>
    </div>
  );
};
