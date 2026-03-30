import { Card } from '@/components/ui/card';

export const FAQSection = () => (
  <Card preset="content" className="space-y-5">
    <h2 className="text-heading-h3">자주 묻는 질문</h2>
    <ul className="space-y-4 text-body-md text-neutral-700">
      <li className="relative pl-4 before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-brand-blue-500">
        도착지는 ETA 계산에 필요해요.
      </li>
      <li className="relative pl-4 before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-brand-blue-500">
        송장번호 형식이 틀리면 조회가 차단돼요.
      </li>
      <li className="relative pl-4 before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-brand-blue-500">
        예측 실패 시 배송 현황은 그대로 확인할 수 있어요.
      </li>
    </ul>
  </Card>
);
