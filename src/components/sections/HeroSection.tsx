import { useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { useGSAP } from '@/hooks/useGSAP';
import { gsap, ScrollTrigger } from '@/lib/gsap-config';
import { AnimatedText } from '@/components/AnimatedText';
import { MagneticButton } from '@/components/MagneticButton';
import { HenIllustration } from '@/components/illustrations/HenIllustration';
import { EggIllustration } from '@/components/illustrations/EggIllustration';
import { SparkleDecoration } from '@/components/illustrations/SparkleDecoration';
import { FloatingIllustration } from '@/components/illustrations/FloatingIllustration';
import {
  PARALLAX_HERO_GRAIN_SPEED,
  PARALLAX_HERO_TITLE_SPEED,
  PARALLAX_HERO_SUBTITLE_SPEED,
} from '@/constants/animation';

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const grainRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const henRef = useRef<HTMLDivElement>(null);
  const egg1Ref = useRef<HTMLDivElement>(null);
  const egg2Ref = useRef<HTMLDivElement>(null);

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

      if (subtitleRef.current) {
        gsap.to(subtitleRef.current, {
          yPercent: PARALLAX_HERO_SUBTITLE_SPEED * 100,
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

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex h-screen overflow-hidden"
      aria-label="Hero"
    >
      {/* Fondo oscuro base */}
      <div
        className="absolute inset-0 z-0"
        style={{ background: 'var(--color-bg-primary)' }}
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

      {/* ── Gallina — personaje principal, esquina derecha ── */}
      <div
        ref={henRef}
        className="pointer-events-none absolute bottom-0 right-[-20px] z-[3] w-[320px] select-none
                   sm:w-[380px] md:right-[-10px] md:w-[430px] lg:right-0 lg:w-[520px]"
      >
        <FloatingIllustration floatY={20} duration={4.2}>
          <HenIllustration />
        </FloatingIllustration>
      </div>

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

      {/* ── Título vanguardista — dos líneas, tamaño extremo ── */}
      <div
        ref={titleRef}
        className="absolute inset-0 z-[4] flex flex-col justify-center px-6 md:px-14 lg:px-20"
      >
        {/* Label */}
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-yolk md:text-xs">
          Premium Egg Retail
        </p>

        {/* "Huevos" — relleno sólido */}
        <div className="mt-1 overflow-hidden">
          <AnimatedText
            text="Huevos"
            as="h1"
            className="block font-display font-black leading-[0.88] tracking-[-0.04em] text-text-primary text-[clamp(3.8rem,14vw,14rem)]"
            delay={0.35}
          />
        </div>

        {/* "Point" — outline: efecto tipográfico vanguardista */}
        <div className="overflow-hidden pl-[0.12em]">
          <AnimatedText
            text="Point"
            as="span"
            className="block font-display font-black leading-[0.88] tracking-[-0.04em] text-transparent text-[clamp(3.8rem,14vw,14rem)] [-webkit-text-stroke:2px_var(--color-text-primary)]"
            delay={0.5}
          />
        </div>
      </div>

      {/* ── Subtitle + CTA ── */}
      <div
        ref={subtitleRef}
        className="absolute bottom-[18vh] z-[5] flex flex-col items-start gap-6 px-6 md:px-14 lg:px-20"
      >
        <p className="font-heading text-lg text-text-secondary md:text-xl">
          Del campo a tu mesa
        </p>
        <MagneticButton onClick={scrollToStory}>
          Descubrí más
        </MagneticButton>
      </div>

      {/* ── Scroll indicator ── */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 z-[6] flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
          Scroll
        </span>
        <ChevronDown className="h-5 w-5 text-text-muted" />
      </div>
    </section>
  );
}
