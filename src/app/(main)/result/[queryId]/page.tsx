import type { Metadata } from 'next';
import { PageHeader } from '@/components/common/page-header';
import { ResultView } from '@/components/result/result-view';

type Props = {
  params: Promise<{ queryId: string }>;
};

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false
  }
};

export default async function ResultPage({ params }: Props) {
  const { queryId } = await params;

  return (
    <div className="app-shell">
      <section className="hero-band">
        <PageHeader />
      </section>
      <main className="content-column">
        <ResultView queryId={queryId} />
      </main>
    </div>
  );
}
