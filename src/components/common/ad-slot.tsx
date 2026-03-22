import { trackEvent } from '@/lib/events';

type Props = {
  slot: 'A' | 'B' | 'C';
};

export const AdSlot = ({ slot }: Props) => {
  trackEvent('ad_impression', { slot });

  return (
    <aside className="card mt-6 border-dashed text-center text-xs text-slate-500" aria-label={`광고 슬롯 ${slot}`}>
      광고 슬롯 {slot}
    </aside>
  );
};
