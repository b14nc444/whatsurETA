import type { Metadata } from 'next';
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
    <main className="container-page">
      <ResultView queryId={queryId} />
    </main>
  );
}
