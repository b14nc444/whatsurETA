'use client';

import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/common/page-header';
import { FAQSection } from '@/components/common/faq-section';
import { AdSlot } from '@/components/common/ad-slot';
import { FloatingHelpButton } from '@/components/common/floating-help-button';
import { SearchForm } from '@/components/input/search-form';
import { EtaCard } from '@/components/result/eta-card';
import { ProgressTable } from '@/components/result/progress-table';
import { ETA_HIDDEN_STATUSES } from '@/lib/constants';
import type { TrackResponse } from '@/types/api';

export default function HomePage() {
  const [result, setResult] = useState<TrackResponse | null>(null);

  const etaHidden = useMemo(() => {
    if (!result) return true;
    return ETA_HIDDEN_STATUSES.includes(result.tracking.deliveryStatus);
  }, [result]);

  return (
    <div className="app-shell">
      <section className="hero-band">
        <PageHeader />
      </section>
      <main className="content-column">
        <SearchForm onSuccess={setResult} />
        {result ? (
          <>
            <EtaCard
              earliestEta={result.prediction.earliestEta}
              latestEta={result.prediction.latestEta}
              hidden={etaHidden}
              reason={result.prediction.reason}
            />
            <ProgressTable progresses={result.tracking.progresses} />
          </>
        ) : null}
        <FAQSection />
        <AdSlot slot="A" />
      </main>
      <FloatingHelpButton />
    </div>
  );
}
