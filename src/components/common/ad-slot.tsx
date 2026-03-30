import { trackEvent } from '@/lib/events';
import { Card } from '@/components/ui/card';

type Props = {
  slot: 'A' | 'B' | 'C';
};

export const AdSlot = ({ slot }: Props) => {
  trackEvent('ad_impression', { slot });

  return (
    <Card
      as="aside"
      borderStyle="dashed"
      className="mt-6 text-center text-xs text-slate-500"
      aria-label={`광고 슬롯 ${slot}`}
    >
      광고 슬롯 {slot}
    </Card>
  );
};
