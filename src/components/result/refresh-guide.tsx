import { Card } from '@/components/ui/card';

type Props = {
  recommendedRefreshAfterMin: number;
};

export const RefreshGuide = ({ recommendedRefreshAfterMin }: Props) => (
  <Card className="text-sm text-slate-700">
    새 배송 이력이 반영되면 예측도 바뀔 수 있어요. 약 {recommendedRefreshAfterMin}분 뒤 다시 조회해보세요.
  </Card>
);
