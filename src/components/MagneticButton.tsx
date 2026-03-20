import { useRef, useCallback, type ReactNode } from 'react';
import { gsap } from '@/lib/gsap-config';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import {
  MAGNETIC_STRENGTH,
  MAGNETIC_FOLLOW_DURATION,
  MAGNETIC_RETURN_DURATION,
  MAGNETIC_RETURN_EASE,
} from '@/constants/animation';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  strength?: number;
  as?: 'button' | 'a';
  href?: string;
}

export function MagneticButton({
  children,
  className,
  onClick,
  strength = MAGNETIC_STRENGTH,
  as: Tag = 'button',
  href,
}: MagneticButtonProps) {
  const elementRef = useRef<HTMLButtonElement & HTMLAnchorElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (prefersReducedMotion) return;
      const el = elementRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(el, {
        x: x * strength,
        y: y * strength,
        duration: MAGNETIC_FOLLOW_DURATION,
        ease: 'power3.out',
      });
    },
    [strength, prefersReducedMotion]
  );

  const handleMouseLeave = useCallback(() => {
    if (prefersReducedMotion) return;
    const el = elementRef.current;
    if (!el) return;

    gsap.to(el, {
      x: 0,
      y: 0,
      duration: MAGNETIC_RETURN_DURATION,
      ease: MAGNETIC_RETURN_EASE,
    });
  }, [prefersReducedMotion]);

  const sharedProps = {
    ref: elementRef,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    className: cn(
      'magnetic-button relative inline-flex items-center justify-center rounded-full bg-yolk px-8 py-4 font-body font-bold text-bg-primary',
      'min-h-[44px] min-w-[44px]',
      'focus-visible:outline-2 focus-visible:outline-yolk focus-visible:outline-offset-4',
      className
    ),
  };

  if (Tag === 'a') {
    return (
      <a {...sharedProps} href={href}>
        {children}
      </a>
    );
  }

  return (
    <button {...sharedProps} onClick={onClick} type="button">
      {children}
    </button>
  );
}
