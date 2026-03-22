import { PageHeader } from '@/components/common/page-header';
import { FAQSection } from '@/components/common/faq-section';
import { AdSlot } from '@/components/common/ad-slot';
import { SearchForm } from '@/components/input/search-form';

export default function HomePage() {
  return (
    <main className="container-page">
      <PageHeader />
      <SearchForm />
      <FAQSection />
      <AdSlot slot="A" />
    </main>
  );
}
