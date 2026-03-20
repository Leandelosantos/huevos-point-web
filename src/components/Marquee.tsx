import { useRef } from 'react';
import { useGSAP } from '@/hooks/useGSAP';
import { gsap } from '@/lib/gsap-config';
import { cn } from '@/lib/utils';
import { MARQUEE_SPEED } from '@/constants/animation';

interface MarqueeProps {
  text: string;
  speed?: number;
  className?: string;
}

export function Marquee({ text, speed = MARQUEE_SPEED, className }: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const track = trackRef.current;
    if (!track) return;

    // Measure one copy's width
    const firstChild = track.children[0] as HTMLElement;
    if (!firstChild) return;
    const totalWidth = firstChild.offsetWidth;

    gsap.to(track, {
      x: -totalWidth,
      duration: totalWidth / speed,
      ease: 'none',
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x: string) => parseFloat(x) % totalWidth),
      },
    });
  }, [speed]);

  return (
    <div
      className={cn('marquee-wrapper overflow-hidden whitespace-nowrap', className)}
      aria-hidden="true"
    >
      <div ref={trackRef} className="marquee-track inline-flex">
        <span className="inline-block font-display text-lg uppercase tracking-[0.2em] text-text-muted md:text-xl">
          {text}
        </span>
        <span className="inline-block font-display text-lg uppercase tracking-[0.2em] text-text-muted md:text-xl">
          {text}
        </span>
      </div>
    </div>
  );
}
