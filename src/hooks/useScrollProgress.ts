import { useState, useEffect, useRef } from 'react';
import { ScrollTrigger } from '@/lib/gsap-config';

/**
 * Returns a normalized scroll progress value (0 to 1) for a given element.
 */
export function useScrollProgress(options?: {
  start?: string;
  end?: string;
}) {
  const [progress, setProgress] = useState(0);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!triggerRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: triggerRef.current,
      start: options?.start ?? 'top bottom',
      end: options?.end ?? 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        setProgress(self.progress);
      },
    });

    return () => {
      trigger.kill();
    };
  }, [options?.start, options?.end]);

  return { progress, triggerRef };
}
