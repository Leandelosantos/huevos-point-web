import { lazy, Suspense } from 'react';
import { Loader } from '@/components/layout/Loader';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { Marquee } from '@/components/Marquee';
import { MARQUEE_TEXT } from '@/constants/business';
import { useAppStore } from '@/stores/useAppStore';

// Lazy load below-the-fold sections for bundle splitting
const StorySection = lazy(() =>
  import('@/components/sections/StorySection').then((m) => ({ default: m.StorySection }))
);
const ProductsSection = lazy(() =>
  import('@/components/sections/ProductsSection').then((m) => ({ default: m.ProductsSection }))
);
const ProcessSection = lazy(() =>
  import('@/components/sections/ProcessSection').then((m) => ({ default: m.ProcessSection }))
);
const CTASection = lazy(() =>
  import('@/components/sections/CTASection').then((m) => ({ default: m.CTASection }))
);
const ContactSection = lazy(() =>
  import('@/components/sections/ContactSection').then((m) => ({ default: m.ContactSection }))
);

function SectionFallback() {
  return <div className="flex min-h-[50vh] items-center justify-center bg-bg-primary" />;
}

export default function App() {
  const isLoading = useAppStore((state) => state.isLoading);

  return (
    <>
      {isLoading && <Loader />}
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <Marquee text={MARQUEE_TEXT} className="py-8 bg-bg-secondary" />
        <Suspense fallback={<SectionFallback />}>
          <StorySection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <ProductsSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <ProcessSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <CTASection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <ContactSection />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
