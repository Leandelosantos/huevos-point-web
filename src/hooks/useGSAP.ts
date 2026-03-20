import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap-config';

/**
 * Custom hook that wraps GSAP animations in a gsap.context() for automatic
 * cleanup on unmount. Prevents memory leaks and orphaned ScrollTriggers.
 *
 * @param callback - Function receiving the gsap.context scope to create animations
 * @param deps - Dependency array (same as useEffect)
 * @param scope - Optional ref to scope all gsap selectors within
 */
export function useGSAP(
  callback: (context: gsap.Context) => void,
  deps: React.DependencyList = [],
  scope?: React.RefObject<HTMLElement | null>
) {
  const contextRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    const ctx = gsap.context((self) => {
      callback(self);
    }, scope?.current ?? undefined);

    contextRef.current = ctx;

    return () => {
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return contextRef;
}
