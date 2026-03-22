type Props = {
  reason: string;
};

export const ReasonCard = ({ reason }: Props) => (
  <section className="card space-y-1">
    <h2 className="text-base font-semibold">예측 근거</h2>
    <p className="text-sm text-slate-700">{reason}</p>
  </section>
);
