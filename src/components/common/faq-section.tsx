import { Card } from '@/components/ui/card';

export const FAQSection = () => (
  <Card className="mt-6 space-y-2">
    <h2 className="text-base font-semibold">자주 묻는 질문</h2>
    <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
      <li>도착지는 ETA 계산에 필요해요.</li>
      <li>송장번호 형식이 틀리면 조회가 차단돼요.</li>
      <li>예측 실패 시 배송 현황은 그대로 확인할 수 있어요.</li>
    </ul>
  </Card>
);
