'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useResult } from '@/hooks/use-result';
import { ETA_HIDDEN_STATUSES, ERROR_MESSAGES } from '@/lib/constants';
import { trackEvent } from '@/lib/events';
import { LoadingState } from '@/components/common/loading-state';
import { ErrorState } from '@/components/error/error-state';
import { SummaryCard } from '@/components/result/summary-card';
import { ProgressTable } from '@/components/result/progress-table';
import { EtaCard } from '@/components/result/eta-card';
import { ReasonCard } from '@/components/result/reason-card';
import { DataSourceBadge } from '@/components/result/data-source-badge';
import { RefreshGuide } from '@/components/result/refresh-guide';
import { AdSlot } from '@/components/common/ad-slot';

type Props = {
  queryId: string;
};

export const ResultView = ({ queryId }: Props) => {
  const router = useRouter();
  const { data, loading, error } = useResult(queryId);

  const etaHidden = useMemo(() => {
    if (!data) return true;
    return ETA_HIDDEN_STATUSES.includes(data.tracking.deliveryStatus);
  }, [data]);

  if (loading) {
    return <LoadingState />;
  }

  if (error || !data) {
    const message = error?.error?.message ?? ERROR_MESSAGES.SYSTEM_ERROR;
    return <ErrorState message={message} />;
  }

  trackEvent('result_view', {
    courierCode: data.tracking.courierCode,
    normalizedStatus: data.tracking.deliveryStatus,
    dataSource: data.dataSource,
    isStale: data.isStale
  });

  if (data.prediction.fallback) {
    trackEvent('eta_fallback', { queryId });
  } else {
    trackEvent('eta_success', { queryId });
  }

  return (
    <div className="space-y-4">
      <div className="card flex items-center justify-between">
        <button type="button" className="btn-secondary" onClick={() => router.back()}>
          뒤로가기
        </button>
        <button type="button" className="btn-primary" onClick={() => window.location.reload()}>
          새로고침
        </button>
      </div>
      <SummaryCard tracking={data.tracking} />
      <AdSlot slot="B" />
      <ProgressTable progresses={data.tracking.progresses} />
      <EtaCard
        earliestEta={data.prediction.earliestEta}
        latestEta={data.prediction.latestEta}
        hidden={etaHidden}
      />
      <ReasonCard reason={data.prediction.reason} />
      <DataSourceBadge dataSource={data.dataSource} isStale={data.isStale} queriedAt={data.meta.queriedAt} />
      <RefreshGuide recommendedRefreshAfterMin={data.meta.recommendedRefreshAfterMin} />
      <AdSlot slot="C" />
    </div>
  );
};
