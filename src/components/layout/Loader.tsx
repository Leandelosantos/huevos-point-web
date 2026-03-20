import { useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap-config';
import { useAppStore } from '@/stores/useAppStore';
import {
  PRELOADER_DURATION,
  PRELOADER_COUNTER_EASE,
  PRELOADER_LOGO_SCALE_FROM,
} from '@/constants/animation';

export function Loader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLParagraphElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const topCurtainRef = useRef<HTMLDivElement>(null);
  const bottomCurtainRef = useRef<HTMLDivElement>(null);
  const setLoading = useAppStore((state) => state.setLoading);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const counter = { value: 0 };
      const tl = gsap.timeline({
        onComplete: () => {
          setLoading(false);
        },
      });

      // t=0.0s → Logo appears (fade + scale from 0.8)
      tl.fromTo(
        logoRef.current,
        { opacity: 0, scale: PRELOADER_LOGO_SCALE_FROM },
        { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' }
      );

      // t=0.3s → Counter 0 → 100
      tl.to(
        counter,
        {
          value: 100,
          duration: PRELOADER_DURATION - 0.5,
          ease: PRELOADER_COUNTER_EASE,
          onUpdate: () => {
            if (counterRef.current) {
              counterRef.current.textContent = `${Math.round(counter.value)}`;
            }
          },
        },
        0.3
      );

      // t=0.3s → Progress bar fills (scaleX: 0 → 1)
      tl.fromTo(
        barRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: PRELOADER_DURATION - 0.5,
          ease: PRELOADER_COUNTER_EASE,
        },
        0.3
      );

      // t=2.6s → Logo goes up
      tl.to(
        logoRef.current,
        { y: '-100%', opacity: 0, duration: 0.3, ease: 'power2.in' },
        PRELOADER_DURATION - 0.4
      );

      // t=2.6s → Counter fades
      tl.to(
        counterRef.current,
        { opacity: 0, duration: 0.2, ease: 'power2.in' },
        PRELOADER_DURATION - 0.4
      );

      // t=2.7s → Curtain splits
      tl.to(
        topCurtainRef.current,
        { yPercent: -100, duration: 0.4, ease: 'power3.inOut' },
        PRELOADER_DURATION - 0.3
      );

      tl.to(
        bottomCurtainRef.current,
        { yPercent: 100, duration: 0.4, ease: 'power3.inOut' },
        PRELOADER_DURATION - 0.3
      );

      // t=3.0s → Container gone
      tl.set(containerRef.current, { display: 'none' });
    }, containerRef);

    // Block scroll during loader
    document.body.style.overflow = 'hidden';

    return () => {
      ctx.revert();
      document.body.style.overflow = '';
    };
  }, [setLoading]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      aria-hidden="true"
    >
      {/* Top curtain */}
      <div
        ref={topCurtainRef}
        className="absolute inset-x-0 top-0 h-1/2 bg-bg-primary"
      />
      {/* Bottom curtain */}
      <div
        ref={bottomCurtainRef}
        className="absolute inset-x-0 bottom-0 h-1/2 bg-bg-primary"
      />

      {/* Centered content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        <p
          ref={logoRef}
          className="font-display text-4xl font-black text-text-primary opacity-0 md:text-5xl"
        >
          Huevos Point
        </p>

        <div className="flex flex-col items-center gap-3">
          <span
            ref={counterRef}
            className="font-mono text-sm text-text-muted"
          >
            0
          </span>
          <div className="h-[2px] w-48 overflow-hidden bg-bg-elevated">
            <div
              ref={barRef}
              className="h-full w-full origin-left bg-yolk"
              style={{ transform: 'scaleX(0)' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
