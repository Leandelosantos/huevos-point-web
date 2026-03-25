import { useRef } from 'react';
import { useGSAP } from '@/hooks/useGSAP';
import { gsap } from '@/lib/gsap-config';

interface FloatingIllustrationProps {
  children: React.ReactNode;
  className?: string;
  floatY?: number;
  duration?: number;
  rotateZ?: number;
  delay?: number;
}

export function FloatingIllustration({
  children,
  className,
  floatY = 14,
  duration = 3.6,
  rotateZ = 0,
  delay = 0,
}: FloatingIllustrationProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;

      // Respeta prefers-reduced-motion
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) return;

      gsap.to(ref.current, {
        y: floatY,
        rotation: rotateZ,
        duration,
        delay,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    },
    [],
    ref
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
