'use client';

import { useMemo } from 'react';
import { useResult } from '@/hooks/use-result';
import { ETA_HIDDEN_STATUSES, ERROR_MESSAGES } from '@/lib/constants';
import { trackEvent } from '@/lib/events';
import { LoadingState } from '@/components/common/loading-state';
import { ErrorState } from '@/components/error/error-state';
import { ProgressTable } from '@/components/result/progress-table';
import { EtaCard } from '@/components/result/eta-card';
import { SearchForm } from '@/components/input/search-form';
import { AdSlot } from '@/components/common/ad-slot';

type Props = {
  queryId: string;
};

export const ResultView = ({ queryId }: Props) => {
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
    <div className="space-y-6">
      <SearchForm />
      <EtaCard
        earliestEta={data.prediction.earliestEta}
        latestEta={data.prediction.latestEta}
        hidden={etaHidden}
        reason={data.prediction.reason}
      />
      <ProgressTable progresses={data.tracking.progresses} />
      <AdSlot slot="C" />
    </div>
  );
};
