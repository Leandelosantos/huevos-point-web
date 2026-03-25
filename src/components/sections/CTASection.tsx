import { useRef } from 'react';
import { useGSAP } from '@/hooks/useGSAP';
import { gsap } from '@/lib/gsap-config';
import { MagneticButton } from '@/components/MagneticButton';
import {
  CTA_BG_TRANSITION_START,
  CTA_BG_TRANSITION_END,
} from '@/constants/animation';
import { HenIllustration } from '@/components/illustrations/HenIllustration';
import { EggIllustration } from '@/components/illustrations/EggIllustration';
import { SparkleDecoration } from '@/components/illustrations/SparkleDecoration';
import { FloatingIllustration } from '@/components/illustrations/FloatingIllustration';

export function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const henRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const scrollConfig = {
        trigger: section,
        start: CTA_BG_TRANSITION_START,
        end: CTA_BG_TRANSITION_END,
        scrub: true,
      };

      // Background transition: dark → cream
      gsap.fromTo(
        section,
        { backgroundColor: 'var(--color-bg-primary)' },
        { backgroundColor: 'var(--color-cream)', scrollTrigger: scrollConfig }
      );

      // Text color transitions en sincronía con el fondo
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { color: 'var(--color-text-primary)' },
          { color: 'var(--color-bg-primary)', scrollTrigger: scrollConfig }
        );
      }
      if (bodyRef.current) {
        gsap.fromTo(
          bodyRef.current,
          { color: 'var(--color-text-secondary)' },
          { color: 'rgba(12,10,9,0.7)', scrollTrigger: scrollConfig }
        );
      }

      // Gallina: aparece junto con la transición del fondo
      if (henRef.current) {
        gsap.fromTo(
          henRef.current,
          { opacity: 0, y: 30 },
          { opacity: 0.8, y: 0, scrollTrigger: scrollConfig }
        );
      }

      // Content fade in
      if (contentRef.current) {
        gsap.from(contentRef.current, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 75%',
          },
        });
      }
    },
    [],
    sectionRef
  );

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      gsap.to(window, {
        scrollTo: { y: contactSection, offsetY: 0 },
        duration: 1,
        ease: 'power3.inOut',
      });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="cta"
      className="cta-section relative overflow-hidden py-section"
      aria-label="Llamada a la acción"
    >
      {/* ── Gallina ilustrada (hero visual de la sección, derecha) ── */}
      <div ref={henRef} className="pointer-events-none absolute -right-8 bottom-0 hidden md:block" style={{ opacity: 0 }}>
        <FloatingIllustration
          className="w-[280px] select-none lg:w-[340px]"
          floatY={18}
          duration={4.5}
        >
          <HenIllustration />
        </FloatingIllustration>
      </div>

      {/* ── Huevo decorativo izquierda ── */}
      <FloatingIllustration
        className="pointer-events-none absolute -left-6 top-[20%] hidden w-[100px] select-none opacity-30 md:block"
        floatY={12}
        duration={3.8}
        delay={0.8}
        rotateZ={3}
      >
        <EggIllustration rotate={-20} variant="cream" />
      </FloatingIllustration>

      {/* ── Sparkles decorativos ── */}
      <SparkleDecoration
        className="pointer-events-none absolute left-[12%] top-[15%] hidden w-[22px] select-none opacity-50 md:block"
        color="#F59E0B"
      />
      <SparkleDecoration
        className="pointer-events-none absolute right-[38%] top-[10%] w-[16px] select-none opacity-40"
        color="#F59E0B"
        variant="cross"
      />
      <SparkleDecoration
        className="pointer-events-none absolute left-[30%] bottom-[20%] hidden w-[14px] select-none opacity-30 md:block"
        color="#F59E0B"
        variant="dot"
      />

      <div
        ref={contentRef}
        className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 text-center"
      >
        <p className="font-mono text-xs uppercase tracking-widest text-yolk-deep">
          Calidad que se siente
        </p>
        <h2 ref={headingRef} className="mt-4 font-display text-section font-bold">
          Probá la diferencia
        </h2>
        <p ref={bodyRef} className="mt-4 max-w-lg font-body text-body">
          Huevos seleccionados a mano, de granjas sustentables, entregados en el día.
          Hacé tu primer pedido y descubrí lo que es un huevo de verdad.
        </p>
        <div className="mt-10">
          <MagneticButton
            onClick={scrollToContact}
            className="bg-bg-primary text-text-primary hover:bg-bg-secondary"
          >
            Hacer mi pedido
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
