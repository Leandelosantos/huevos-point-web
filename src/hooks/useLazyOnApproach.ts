import { useEffect, useState, type RefObject } from 'react';
import { LAZY_INIT_OFFSET } from '@/constants/animation';

/**
 * true recién cuando el elemento está a LAZY_INIT_OFFSET px de entrar al viewport.
 * Evita cargar chunks pesados (ej. EggCanvas/Three.js) en secciones below-the-fold
 * que el usuario puede no llegar a ver nunca.
 */
export function useLazyOnApproach(
  ref: RefObject<HTMLElement | null>,
  enabled = true
): boolean {
  const [isNear, setIsNear] = useState(false);

  useEffect(() => {
    if (!enabled || isNear) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: `${LAZY_INIT_OFFSET}px` }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, enabled, isNear]);

  return isNear;
}
