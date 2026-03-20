import { useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { useGSAP } from '@/hooks/useGSAP';
import { gsap } from '@/lib/gsap-config';
import { AnimatedText } from '@/components/AnimatedText';
import { MagneticButton } from '@/components/MagneticButton';
import {
  PARALLAX_HERO_BG_SPEED,
  PARALLAX_HERO_GRAIN_SPEED,
  PARALLAX_HERO_TITLE_SPEED,
  PARALLAX_HERO_SUBTITLE_SPEED,
} from '@/constants/animation';

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const grainRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      // Parallax layers on scroll
      const parallaxConfig = {
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      };

      // Layer 1: Background (0.3x speed)
      if (bgRef.current) {
        gsap.to(bgRef.current, {
          yPercent: PARALLAX_HERO_BG_SPEED * 100,
          ease: 'none',
          ...parallaxConfig,
        });
      }

      // Layer 3: Grain texture (0.5x speed)
      if (grainRef.current) {
        gsap.to(grainRef.current, {
          yPercent: PARALLAX_HERO_GRAIN_SPEED * 100,
          ease: 'none',
          ...parallaxConfig,
        });
      }

      // Layer 4: Title (0.7x speed + compress + fade)
      if (titleRef.current) {
        gsap.to(titleRef.current, {
          yPercent: PARALLAX_HERO_TITLE_SPEED * 100,
          scaleY: 0.8,
          opacity: 0,
          ease: 'none',
          ...parallaxConfig,
        });
      }

      // Layer 5: Subtitle + CTA (0.9x speed)
      if (subtitleRef.current) {
        gsap.to(subtitleRef.current, {
          yPercent: PARALLAX_HERO_SUBTITLE_SPEED * 100,
          opacity: 0,
          ease: 'none',
          ...parallaxConfig,
        });
      }

      // Scroll indicator pulse
      if (scrollIndicatorRef.current) {
        gsap.to(scrollIndicatorRef.current, {
          y: 8,
          opacity: 0.4,
          duration: 1.2,
          ease: 'power1.inOut',
          repeat: -1,
          yoyo: true,
        });

        // Fade out indicator when scrolling starts
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
      {/* Layer 1: Background */}
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

      {/* Layer 4: Title */}
      <div ref={titleRef} className="relative z-[3] text-center px-6">
        <AnimatedText
          text="Huevos Point"
          as="h1"
          className="font-display text-hero font-black text-text-primary"
          delay={3.2}
        />
      </div>

      {/* Layer 5: Subtitle + CTA */}
      <div ref={subtitleRef} className="absolute bottom-[20vh] z-[4] flex flex-col items-center gap-6 px-6 text-center md:bottom-[18vh]">
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
        className="absolute bottom-8 z-[5] flex flex-col items-center gap-2"
      >
        <span className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
          Scroll
        </span>
        <ChevronDown className="h-5 w-5 text-text-muted" />
      </div>
    </section>
  );
}
