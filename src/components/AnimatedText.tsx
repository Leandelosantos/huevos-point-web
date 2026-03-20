import { useRef } from 'react';
import { useGSAP } from '@/hooks/useGSAP';
import { gsap } from '@/lib/gsap-config';
import { cn } from '@/lib/utils';
import { HERO_TITLE_STAGGER, HERO_TITLE_EASE } from '@/constants/animation';

interface AnimatedTextProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  stagger?: number;
  ease?: string;
  delay?: number;
  scrollTrigger?: gsap.DOMTarget | false;
}

export function AnimatedText({
  text,
  as: Tag = 'span',
  className,
  stagger = HERO_TITLE_STAGGER,
  ease = HERO_TITLE_EASE,
  delay = 0,
  scrollTrigger = false,
}: AnimatedTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const chars = container.querySelectorAll('.animated-char');
      if (!chars.length) return;

      const animConfig: gsap.TweenVars = {
        y: 40,
        opacity: 0,
        stagger,
        duration: 0.6,
        ease,
        delay,
      };

      if (scrollTrigger) {
        animConfig.scrollTrigger = {
          trigger: scrollTrigger,
          start: 'top 75%',
        };
      }

      gsap.from(chars, animConfig);
    },
    [stagger, ease, delay, scrollTrigger]
  );

  const words = text.split(' ');

  return (
    <div ref={containerRef}>
      <Tag className={cn('animated-text', className)} aria-label={text}>
        {words.map((word, wordIndex) => (
          <span key={`word-${wordIndex}`} className="inline-block whitespace-nowrap">
            {word.split('').map((char, charIndex) => (
              <span
                key={`${wordIndex}-${charIndex}`}
                className="animated-char inline-block"
                aria-hidden="true"
              >
                {char}
              </span>
            ))}
            {wordIndex < words.length - 1 && (
              <span className="inline-block" aria-hidden="true">
                &nbsp;
              </span>
            )}
          </span>
        ))}
      </Tag>
    </div>
  );
}
