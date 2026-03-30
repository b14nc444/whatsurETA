import type { Tracking } from '@/types/tracking';
import { formatDateTimeKo } from '@/lib/formatter';
import { Card } from '@/components/ui/card';

type Props = {
  tracking: Tracking;
};

export const SummaryCard = ({ tracking }: Props) => (
  <Card className="space-y-1">
    <h2 className="text-base font-semibold">배송 요약</h2>
    <p className="text-sm">택배사: {tracking.courierName}</p>
    <p className="text-sm">송장번호: {tracking.trackingNumberMasked}</p>
    <p className="text-sm">현재 상태: {tracking.deliveryStatusText}</p>
    <p className="text-sm">마지막 처리 시각: {formatDateTimeKo(tracking.lastProgressAt)}</p>
    <p className="text-sm">마지막 위치: {tracking.lastLocation ?? '-'}</p>
  </Card>
);
