import { Badge, BadgeGroup } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

type Props = {
  dataSource: 'live' | 'cache';
  isStale: boolean;
  queriedAt: string;
};

export const DataSourceBadge = ({ dataSource, isStale, queriedAt }: Props) => (
  <Card className="text-xs text-slate-600">
    <BadgeGroup>
      <Badge tone="info" emphasis="soft">
        출처: {dataSource}
      </Badge>
      <Badge tone={isStale ? 'warning' : 'success'} emphasis="soft">
        stale: {isStale ? 'Y' : 'N'}
      </Badge>
      <Badge tone="default" emphasis="outline">
        마지막 조회: {new Date(queriedAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}
      </Badge>
    </BadgeGroup>
  </Card>
);
