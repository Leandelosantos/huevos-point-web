import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useGSAP } from '@/hooks/useGSAP';
import { gsap } from '@/lib/gsap-config';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { MagneticButton } from '@/components/MagneticButton';
import {
  CTA_BG_TRANSITION_START,
  CTA_BG_TRANSITION_END,
} from '@/constants/animation';
import { HenIllustration } from '@/components/illustrations/HenIllustration';
import { EggIllustration } from '@/components/illustrations/EggIllustration';
import { SparkleDecoration } from '@/components/illustrations/SparkleDecoration';
import { FloatingIllustration } from '@/components/illustrations/FloatingIllustration';

const EggCanvas = lazy(() => import('@/components/EggCanvas'));

const EGG_SHAPE_PATH =
  'M 50 5 C 24 5 8 38 8 66 C 8 100 26 123 50 123 C 74 123 92 100 92 66 C 92 38 76 5 50 5 Z';

export function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const henRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const eggCanvasWrapRef = useRef<HTMLDivElement>(null);
  const eggLabelRef = useRef<HTMLSpanElement>(null);
  const isBreakingRef = useRef(false);
  const eggProgressRef = useRef(0);
  const [show3DEgg, setShow3DEgg] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(() => setShow3DEgg(true));
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(() => setShow3DEgg(true), 200);
    return () => window.clearTimeout(id);
  }, [prefersReducedMotion]);

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

  // Animación "huevo se resquebraja" → al terminar, recién entonces scrollea
  const handleEggClick = () => {
    if (prefersReducedMotion) {
      scrollToContact();
      return;
    }

    if (isBreakingRef.current) return;
    isBreakingRef.current = true;

    const wrap = eggCanvasWrapRef.current;
    const label = eggLabelRef.current;
    if (!wrap || !label) {
      scrollToContact();
      isBreakingRef.current = false;
      return;
    }

    const progress = { value: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        scrollToContact();
        // Restaura el huevo una vez que la sección ya quedó fuera de vista
        gsap.delayedCall(1.4, () => {
          tl.progress(0).pause();
          eggProgressRef.current = 0;
          gsap.set([wrap, label], { clearProps: 'all' });
          isBreakingRef.current = false;
        });
      },
    });

    // Tiembla antes de quebrarse
    tl.to(wrap, { rotation: -3, x: -2, duration: 0.07, ease: 'power1.inOut', force3D: true })
      .to(wrap, { rotation: 3, x: 2, duration: 0.07, ease: 'power1.inOut', force3D: true })
      .to(wrap, { rotation: -2, x: -1, duration: 0.07, ease: 'power1.inOut', force3D: true })
      .to(wrap, { rotation: 0, x: 0, duration: 0.07, ease: 'power1.inOut', force3D: true })
      // El huevo 3D se resquebraja y desaparece
      .to(
        progress,
        {
          value: 1,
          duration: 1.1,
          ease: 'power2.in',
          onUpdate: () => {
            eggProgressRef.current = progress.value;
          },
        },
        '+=0.05'
      )
      .to(wrap, { opacity: 0, duration: 0.3 }, '-=0.3')
      .to(label, { opacity: 0, scale: 0.85, duration: 0.25 }, '<');
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
        <p className="font-mono text-lg uppercase tracking-widest text-yolk-deep">
          CALIDAD QUE SE SIENTE
        </p>
        <h2 ref={headingRef} className="mt-4 font-display text-4xl sm:text-6xl lg:text-9xl font-bold">
          PROBA LA DIFERENCIA
        </h2>
        <p ref={bodyRef} className="mt-4 max-w-2xl font-body text-lg sm:text-2xl lg:text-3xl">
          Huevos seleccionados a mano, de granjas sustentables, entregados en el día.
          Hacé tu primer pedido y descubrí lo que es un huevo de verdad.
        </p>
        <div className="mt-10">
          <MagneticButton
            onClick={handleEggClick}
            className="group btn-egg btn-egg--lg bg-bg-primary text-text-primary hover:bg-yolk hover:text-brand-blue text-xs font-bold uppercase tracking-wider transition-colors duration-300"
          >
            <div ref={eggCanvasWrapRef} className="btn-egg__shape">
              {show3DEgg ? (
                <Suspense fallback={null}>
                  <EggCanvas progressRef={eggProgressRef} />
                </Suspense>
              ) : (
                <svg viewBox="0 0 100 128" preserveAspectRatio="none" aria-hidden="true" className="h-full w-full">
                  <path d={EGG_SHAPE_PATH} fill="var(--color-yolk)" />
                </svg>
              )}
            </div>
            <span ref={eggLabelRef} className="btn-egg__label flex flex-col items-center gap-0.5">
              <span className="text-yolk group-hover:text-brand-blue transition-colors duration-300">Hacer</span>
              <span className="text-yolk group-hover:text-brand-blue transition-colors duration-300">mi pedido</span>
            </span>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
