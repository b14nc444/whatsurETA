import { formatEtaLabel } from '@/lib/formatter';

type Props = {
  earliestEta: string | null;
  latestEta: string | null;
  hidden: boolean;
};

export const EtaCard = ({ earliestEta, latestEta, hidden }: Props) => {
  if (hidden) {
    return <section className="card text-sm text-slate-600">현재 상태에서는 ETA를 제공하지 않아요.</section>;
  }

  if (!earliestEta || !latestEta) {
    return <section className="card text-sm text-slate-600">도착 시간 예측이 어려워요.</section>;
  }

  return (
    <section className="card space-y-1">
      <h2 className="text-base font-semibold">도착 예상 시간</h2>
      <p className="text-sm">
        빠르면 <strong>{formatEtaLabel(earliestEta)}</strong>
      </p>
      <p className="text-sm">
        늦으면 <strong>{formatEtaLabel(latestEta)}</strong>
      </p>
    </section>
  );
};
