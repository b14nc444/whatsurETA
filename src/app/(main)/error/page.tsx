import { ErrorState } from '@/components/error/error-state';

export default function ErrorPage() {
  return (
    <main className="container-page">
      <ErrorState message="일시적인 오류가 발생했어요. 잠시 후 다시 시도해주세요." />
    </main>
  );
}
