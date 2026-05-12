import { useRef } from 'react';
import { useGSAP } from '@/hooks/useGSAP';
import { gsap } from '@/lib/gsap-config';
import { useIsMobile } from '@/hooks/useMediaQuery';

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
  const ref     = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useGSAP(
    () => {
      if (!ref.current) return;
      // Disable continuous floating on mobile (battery + performance — rule #12)
      if (isMobile) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

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
    [isMobile],
    ref
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
