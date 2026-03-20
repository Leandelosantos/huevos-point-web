import { useRef } from 'react';
import { useGSAP } from '@/hooks/useGSAP';
import { gsap } from '@/lib/gsap-config';
import { MagneticButton } from '@/components/MagneticButton';
import {
  CTA_BG_TRANSITION_START,
  CTA_BG_TRANSITION_END,
} from '@/constants/animation';

export function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      // Background transition: dark → cream
      gsap.fromTo(
        section,
        { backgroundColor: 'var(--color-bg-primary)' },
        {
          backgroundColor: 'var(--color-cream)',
          scrollTrigger: {
            trigger: section,
            start: CTA_BG_TRANSITION_START,
            end: CTA_BG_TRANSITION_END,
            scrub: true,
          },
        }
      );

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
      className="cta-section py-section"
      aria-label="Llamada a la acción"
    >
      <div
        ref={contentRef}
        className="mx-auto flex max-w-3xl flex-col items-center px-6 text-center"
      >
        <p className="font-mono text-xs uppercase tracking-widest text-yolk-deep">
          Calidad que se siente
        </p>
        <h2 className="mt-4 font-display text-section font-bold text-bg-primary">
          Probá la diferencia
        </h2>
        <p className="mt-4 max-w-lg font-body text-body text-bg-primary/70">
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
