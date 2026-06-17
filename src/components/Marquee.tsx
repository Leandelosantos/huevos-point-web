import { useRef } from 'react';
import { useGSAP } from '@/hooks/useGSAP';
import { gsap } from '@/lib/gsap-config';
import { cn } from '@/lib/utils';
import { EggIllustration } from '@/components/illustrations/EggIllustration';
import { MARQUEE_SPEED } from '@/constants/animation';

interface MarqueeProps {
  words: readonly string[];
  speed?: number;
  className?: string;
}

export function Marquee({ words, speed = MARQUEE_SPEED, className }: MarqueeProps) {
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

  const renderGroup = (key: number) => (
    <div key={key} className="inline-flex shrink-0 items-center">
      {words.map((word, i) => (
        <span key={i} className="inline-flex items-center">
          <span className="font-display text-[clamp(2rem,6vw,5rem)] font-black uppercase leading-none tracking-tight text-bg-primary">
            {word}
          </span>
          <EggIllustration
            variant="cream"
            rotate={i % 2 === 0 ? -8 : 8}
            className="mx-6 h-[clamp(1.75rem,4.5vw,3.75rem)] w-auto shrink-0 md:mx-10"
          />
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={cn('marquee-wrapper overflow-hidden whitespace-nowrap', className)}
      aria-hidden="true"
    >
      <div ref={trackRef} className="marquee-track inline-flex">
        {renderGroup(0)}
        {renderGroup(1)}
      </div>
    </div>
  );
}
