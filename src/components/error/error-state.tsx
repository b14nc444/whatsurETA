import Link from 'next/link';

type Props = {
  title?: string;
  message: string;
};

export const ErrorState = ({ title = '오류가 발생했어요', message }: Props) => (
  <section className="card space-y-3 text-sm">
    <h2 className="text-base font-semibold text-red-700">{title}</h2>
    <p className="text-slate-700">{message}</p>
    <Link href="/" className="btn-secondary">
      홈으로 이동
    </Link>
  </section>
);
