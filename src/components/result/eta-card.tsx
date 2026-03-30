import { formatEtaLabel } from '@/lib/formatter';
import { Card } from '@/components/ui/card';

type Props = {
  earliestEta: string | null;
  latestEta: string | null;
  hidden: boolean;
  reason: string;
};

export const EtaCard = ({ earliestEta, latestEta, hidden, reason }: Props) => {
  if (hidden) {
    return (
      <Card preset="content" className="space-y-4">
        <h2 className="text-heading-h3">예상 도착 시간</h2>
        <p className="rounded-2xl border border-[#FFF085] bg-[#FEFCE8] px-6 py-8 text-body-lg text-neutral-700">
          현재 배송 단계에서는 정확한 도착 시간 예측이 어려워요. 배송 현황을 참고해주세요.
        </p>
      </Card>
    );
  }

  if (!earliestEta || !latestEta) {
    return <Card preset="content" className="text-body-sm text-neutral-700">도착 시간 예측이 어려워요.</Card>;
  }

  return (
    <Card preset="content" className="space-y-4">
      <h2 className="text-heading-h3">예상 도착 시간</h2>
      <div className="grid gap-3 md:grid-cols-2">
        <section className="rounded-xl border border-brand-blue-100 bg-brand-blue-50 p-4">
          <p className="text-caption text-neutral-500">빠르면</p>
          <p className="mt-1 text-heading-h3 text-brand-blue-600">{formatEtaLabel(earliestEta)}</p>
        </section>
        <section className="rounded-xl border border-brand-purple-100 bg-brand-purple-50 p-4">
          <p className="text-caption text-neutral-500">늦으면</p>
          <p className="mt-1 text-heading-h3 text-brand-purple-600">{formatEtaLabel(latestEta)}</p>
        </section>
      </div>
      <p className="rounded-lg bg-neutral-50 px-3 py-2 text-caption text-neutral-500">{reason}</p>
    </Card>
  );
};
