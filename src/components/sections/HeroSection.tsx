import { lazy, Suspense, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { useGSAP } from '@/hooks/useGSAP';
import { gsap, ScrollTrigger } from '@/lib/gsap-config';
import { AnimatedText } from '@/components/AnimatedText';
import { MagneticButton } from '@/components/MagneticButton';
import {
  PARALLAX_HERO_BG_SPEED,
  PARALLAX_HERO_GRAIN_SPEED,
  PARALLAX_HERO_TITLE_SPEED,
  PARALLAX_HERO_SUBTITLE_SPEED,
} from '@/constants/animation';

// Lazy load del canvas Three.js — mantiene el bundle inicial pequeño
const EggCanvas = lazy(() => import('@/components/EggCanvas'));

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const grainRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  // Ref compartida con EggScene — actualizada por ScrollTrigger sin causar re-renders
  const progressRef = useRef<number>(0);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      // ─── PIN + animación del huevo (400vh de scroll) ───
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=400%',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      // Actualiza el progress para EggScene en cada frame de scroll
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=400%',
        onUpdate: (self) => {
          progressRef.current = self.progress;
        },
      });

      // Reveal del contenido cuando el huevo está ~60% abierto
      // (tl position "3" = 60% del timeline de 5 unidades)
      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 50, filter: 'blur(12px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.5, ease: 'power2.out' },
        3
      );
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 30, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2, ease: 'power2.out' },
        3.4
      );

      // ─── Parallax multi-capa (se activa al salir del pin) ───
      const parallaxConfig = {
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      };

      if (bgRef.current) {
        gsap.to(bgRef.current, {
          yPercent: PARALLAX_HERO_BG_SPEED * 100,
          ease: 'none',
          ...parallaxConfig,
        });
      }

      if (grainRef.current) {
        gsap.to(grainRef.current, {
          yPercent: PARALLAX_HERO_GRAIN_SPEED * 100,
          ease: 'none',
          ...parallaxConfig,
        });
      }

      if (titleRef.current) {
        gsap.to(titleRef.current, {
          yPercent: PARALLAX_HERO_TITLE_SPEED * 100,
          scaleY: 0.8,
          opacity: 0,
          ease: 'none',
          ...parallaxConfig,
        });
      }

      if (subtitleRef.current) {
        gsap.to(subtitleRef.current, {
          yPercent: PARALLAX_HERO_SUBTITLE_SPEED * 100,
          opacity: 0,
          ease: 'none',
          ...parallaxConfig,
        });
      }

      // Scroll indicator: pulso + fade al scrollear
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

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      aria-label="Hero"
    >
      {/* Layer 1: Background image */}
      <div
        ref={bgRef}
        className="absolute inset-0 z-0 bg-bg-primary"
        style={{
          backgroundImage: 'url(/images/hero/hero-bg.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Layer 2: Gradient overlay (static) */}
      <div
        className="absolute inset-0 z-[1]"
        style={{ background: 'var(--color-gradient-hero)' }}
      />

      {/* Layer 3: Grain texture */}
      <div
        ref={grainRef}
        className="absolute inset-0 z-[2] opacity-[var(--color-grain-opacity)]"
        style={{
          backgroundImage: 'url(/images/textures/grain.png)',
          backgroundRepeat: 'repeat',
          backgroundSize: '64px 64px',
        }}
      />

      {/* Layer 4: Egg 3D canvas — transparente, flota sobre el fondo */}
      <Suspense fallback={null}>
        <div className="absolute inset-0 z-[3]">
          <EggCanvas progressRef={progressRef} />
        </div>
      </Suspense>

      {/* Layer 5: Título — oculto al inicio, aparece desde el interior del huevo */}
      <div
        ref={titleRef}
        className="relative z-[4] text-center px-6"
        style={{ opacity: 0 }}
      >
        <AnimatedText
          text="Huevos Point"
          as="h1"
          className="font-display text-hero font-black text-text-primary"
          delay={0}
        />
      </div>

      {/* Layer 6: Subtitle + CTA — oculto al inicio */}
      <div
        ref={subtitleRef}
        className="absolute bottom-[20vh] z-[5] flex flex-col items-center gap-6 px-6 text-center md:bottom-[18vh]"
        style={{ opacity: 0 }}
      >
        <p className="font-heading text-xl text-text-secondary md:text-2xl">
          Premium Egg Retail — Del campo a tu mesa
        </p>
        <MagneticButton onClick={scrollToStory} className="mt-2">
          Descubrí más
        </MagneticButton>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 z-[6] flex flex-col items-center gap-2"
      >
        <span className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
          Scroll
        </span>
        <ChevronDown className="h-5 w-5 text-text-muted" />
      </div>
    </section>
  );
}
