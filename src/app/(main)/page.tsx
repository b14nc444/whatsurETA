import { PageHeader } from '@/components/common/page-header';
import { FAQSection } from '@/components/common/faq-section';
import { AdSlot } from '@/components/common/ad-slot';
import { FloatingHelpButton } from '@/components/common/floating-help-button';
import { SearchForm } from '@/components/input/search-form';

export default function HomePage() {
  return (
    <div className="app-shell">
      <section className="hero-band">
        <PageHeader />
      </section>
      <main className="content-column">
        <SearchForm />
        <FAQSection />
        <AdSlot slot="A" />
      </main>
      <FloatingHelpButton />
    </div>
  );
}
