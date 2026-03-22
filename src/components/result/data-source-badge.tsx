type Props = {
  dataSource: 'live' | 'cache';
  isStale: boolean;
  queriedAt: string;
};

export const DataSourceBadge = ({ dataSource, isStale, queriedAt }: Props) => (
  <section className="card flex flex-wrap items-center gap-3 text-xs text-slate-600">
    <span>출처: {dataSource}</span>
    <span>stale: {isStale ? 'Y' : 'N'}</span>
    <span>마지막 조회: {new Date(queriedAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}</span>
  </section>
);
