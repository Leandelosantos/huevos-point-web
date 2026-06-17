import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useIsMobile, usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { ChevronDown } from 'lucide-react';
import { useGSAP } from '@/hooks/useGSAP';
import { gsap, ScrollTrigger } from '@/lib/gsap-config';
import { AnimatedText } from '@/components/AnimatedText';
import { MagneticButton } from '@/components/MagneticButton';
import { EggIllustration } from '@/components/illustrations/EggIllustration';
import { SparkleDecoration } from '@/components/illustrations/SparkleDecoration';
import { FloatingIllustration } from '@/components/illustrations/FloatingIllustration';
import {
  PARALLAX_HERO_GRAIN_SPEED,
  PARALLAX_HERO_TITLE_SPEED,
} from '@/constants/animation';

const EggCanvas = lazy(() => import('@/components/EggCanvas'));

const EGG_SHAPE_PATH =
  'M 50 5 C 24 5 8 38 8 66 C 8 100 26 123 50 123 C 74 123 92 100 92 66 C 92 38 76 5 50 5 Z';

export function HeroSection() {
  const isMobile   = useIsMobile();
  const prefersReducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const grainRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const henRef = useRef<HTMLDivElement>(null);
  const egg1Ref = useRef<HTMLDivElement>(null);
  const egg2Ref = useRef<HTMLDivElement>(null);
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

      // ─── Entrada: ilustraciones escalan + aparecen ───
      gsap.from(henRef.current, {
        scale: 0.88,
        opacity: 0,
        y: 50,
        duration: 1.6,
        ease: 'power3.out',
        delay: 0.2,
      });

      gsap.from([egg1Ref.current, egg2Ref.current], {
        scale: 0.7,
        opacity: 0,
        duration: 1.2,
        stagger: 0.18,
        ease: 'power2.out',
        delay: 0.5,
      });

      // ─── Parallax multi-capa al salir del hero ───
      const parallaxBase = {
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      };

      if (grainRef.current) {
        gsap.to(grainRef.current, {
          yPercent: PARALLAX_HERO_GRAIN_SPEED * 100,
          ease: 'none',
          ...parallaxBase,
        });
      }

      if (titleRef.current) {
        gsap.to(titleRef.current, {
          yPercent: PARALLAX_HERO_TITLE_SPEED * 100,
          opacity: 0,
          ease: 'none',
          ...parallaxBase,
        });
      }

      // Gallina: parallax más lento (capa más "cercana")
      if (henRef.current) {
        gsap.to(henRef.current, {
          yPercent: -12,
          ease: 'none',
          ...parallaxBase,
        });
      }

      // Huevos: se alejan más rápido (capa "lejana")
      if (egg1Ref.current) {
        gsap.to(egg1Ref.current, {
          yPercent: -45,
          rotate: 18,
          ease: 'none',
          ...parallaxBase,
        });
      }
      if (egg2Ref.current) {
        gsap.to(egg2Ref.current, {
          yPercent: -60,
          rotate: -12,
          ease: 'none',
          ...parallaxBase,
        });
      }

      // Scroll indicator: pulso infinito + fade al scrollear
      if (scrollIndicatorRef.current) {
        gsap.to(scrollIndicatorRef.current, {
          y: 8,
          opacity: 0.4,
          duration: 1.2,
          ease: 'power1.inOut',
          repeat: -1,
          yoyo: true,
        });

        gsap.to(scrollIndicatorRef.current, {
          opacity: 0,
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=100',
            scrub: true,
          },
        });
      }

      ScrollTrigger.refresh();
    },
    [],
    sectionRef
  );

  const scrollToStory = () => {
    const storySection = document.getElementById('story');
    if (storySection) {
      gsap.to(window, {
        scrollTo: { y: storySection, offsetY: 0 },
        duration: 1.2,
        ease: 'power3.inOut',
      });
    }
  };

  // Animación "huevo se resquebraja" → al terminar, recién entonces scrollea
  const handleEggClick = () => {
    if (prefersReducedMotion) {
      scrollToStory();
      return;
    }

    if (isBreakingRef.current) return;
    isBreakingRef.current = true;

    const wrap = eggCanvasWrapRef.current;
    const label = eggLabelRef.current;
    if (!wrap || !label) {
      scrollToStory();
      isBreakingRef.current = false;
      return;
    }

    const progress = { value: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        scrollToStory();
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
      // El huevo 3D se abre y la yema cae
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
      id="hero"
      className="relative flex h-[100dvh] overflow-hidden"
      aria-label="Hero"
    >
      {/* Fondo oscuro base */}
      <div
        className="absolute inset-0 z-0"
        style={{ background: 'var(--color-brand-blue)' }}
      />

      {/* Gradient overlay — profundidad desde abajo */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: 'var(--color-gradient-hero)' }}
      />

      {/* Grain texture */}
      <div
        ref={grainRef}
        className="pointer-events-none absolute inset-0 z-[2] opacity-[var(--color-grain-opacity)]"
        style={{
          backgroundImage: 'url(/images/textures/grain.png)',
          backgroundRepeat: 'repeat',
          backgroundSize: '64px 64px',
        }}
      />

      {/* ── Logo — elemento principal, esquina derecha ── */}
      {/* <div
        ref={henRef}
        className="pointer-events-none absolute bottom-0 right-[-20px] z-[3] w-[280px] select-none
                   sm:w-[340px] md:right-[-10px] md:w-[380px] lg:right-0 lg:w-[460px]"
      >
        <FloatingIllustration floatY={14} duration={4.2}>
          <img
            src="/images/logo.png"
            alt="Huevos Point"
            className="w-full"
            style={{
              mixBlendMode: 'screen',
              filter: isMobile
                ? 'drop-shadow(0 4px 20px rgba(245,158,11,0.6))'
                : 'drop-shadow(0 0 60px rgba(245,158,11,0.55)) drop-shadow(0 16px 80px rgba(245,158,11,0.35)) drop-shadow(0 4px 20px rgba(245,158,11,0.7))',
            }}
            draggable={false}
          />
        </FloatingIllustration>
      </div> */}

      {/* ── Huevos decorativos — capas de profundidad ── */}
      <div
        ref={egg1Ref}
        className="pointer-events-none absolute left-[3%] top-[20%] z-[3] w-[120px] select-none opacity-35
                   md:left-[5%] md:w-[150px]"
      >
        <EggIllustration rotate={-20} variant="outline" />
      </div>
      <div
        ref={egg2Ref}
        className="pointer-events-none absolute bottom-[22%] left-[6%] z-[3] w-[80px] select-none opacity-20
                   md:bottom-[28%] md:left-[8%] md:w-[96px]"
      >
        <EggIllustration rotate={14} variant="outline" />
      </div>

      {/* ── Sparkles decorativos ── */}
      <SparkleDecoration
        className="pointer-events-none absolute right-[30%] top-[14%] z-[3] w-[26px] select-none opacity-55"
        color="#F59E0B"
      />
      <SparkleDecoration
        className="pointer-events-none absolute right-[20%] bottom-[30%] z-[3] w-[18px] select-none opacity-40"
        color="#F59E0B"
        variant="cross"
      />
      <SparkleDecoration
        className="pointer-events-none absolute left-[22%] top-[42%] z-[3] w-[12px] select-none opacity-30"
        color="#F0EAD6"
        variant="dot"
      />
      <SparkleDecoration
        className="pointer-events-none absolute left-[15%] top-[18%] z-[3] w-[16px] select-none opacity-25"
        color="#F0EAD6"
        variant="star4"
      />

      {/* ── Título vanguardista — centrado, logo inline ── */}
      <div
        ref={titleRef}
        className="absolute inset-0 z-[4] flex flex-col items-center justify-center gap-2 px-2 text-center md:px-8"
      >
        {/* Label */}
        <p className="font-oswald font-normal text-[10px] uppercase tracking-[0.3em] text-yolk md:text-base">
          De la granja a tu mesa
        </p>

        {/* "HUEVOS POINT" — una línea centrada */}
        <div className="hero-title flex w-full flex-row flex-nowrap items-center justify-center gap-8 text-[clamp(2.4rem,9vw,12rem)] lg:text-[clamp(2.4rem,10vw,13rem)]">
          <div className="overflow-hidden">
            <AnimatedText
              text="HUEVOS"
              as="h1"
              className="block font-oswald font-bold leading-[0.88] tracking-[0.05em] text-text-primary [transform:scaleY(1.15)] text-[clamp(2.8rem,11vw,14rem)] lg:text-[clamp(3rem,14.5vw,17rem)]"
              delay={0.35}
            />
          </div>

          <div className="overflow-hidden">
            <AnimatedText
              text="POINT"
              as="span"
              className="block font-oswald font-bold leading-[0.88] tracking-[0.05em] text-text-primary [transform:scaleY(1.15)] text-[clamp(2.8rem,11vw,14rem)] lg:text-[clamp(3rem,14.5vw,17rem)]"
              delay={0.5}
            />
          </div>
        </div>

        {/* Sub-label */}
        <p className="font-oswald font-normal text-[10px] uppercase tracking-[0.5em] text-yolk md:text-base">
          Huevos de verdad
        </p>

        {/* CTA — botón con forma de huevo, se resquebraja al hacer click */}
        <MagneticButton
          onClick={handleEggClick}
          className="btn-egg mt-4 text-brand-blue text-xs font-bold uppercase tracking-wider md:mt-8"
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
            <span>ROMPER</span>
          </span>
        </MagneticButton>
      </div>

      {/* ── Scroll indicator ── */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 z-[6] hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex"
      >
        <span className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
          Scroll
        </span>
        <ChevronDown className="h-5 w-5 text-text-muted" />
      </div>
    </section>
  );
}
