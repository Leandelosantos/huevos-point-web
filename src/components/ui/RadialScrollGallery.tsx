import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap-config';
import { useGSAP } from '@/hooks/useGSAP';

function useMergeRefs<T>(...refs: (Ref<T> | undefined)[]) {
  return useMemo(() => {
    if (refs.every((ref) => ref == null)) return null;
    return (node: T) => {
      refs.forEach((ref) => {
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref != null) {
          (ref as React.MutableRefObject<T | null>).current = node;
        }
      });
    };
  }, [refs]);
}

function useResponsiveValue(baseValue: number, mobileValue: number) {
  const [value, setValue] = useState(baseValue);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () =>
      setValue(window.innerWidth < 768 ? mobileValue : baseValue);
    handleResize();
    let id: ReturnType<typeof setTimeout>;
    const debounced = () => {
      clearTimeout(id);
      id = setTimeout(handleResize, 100);
    };
    window.addEventListener('resize', debounced);
    return () => {
      window.removeEventListener('resize', debounced);
      clearTimeout(id);
    };
  }, [baseValue, mobileValue]);
  return value;
}

export interface RadialScrollGalleryProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  children: (hoveredIndex: number | null) => ReactNode[];
  scrollDuration?: number;
  visiblePercentage?: number;
  baseRadius?: number;
  mobileRadius?: number;
  startTrigger?: string;
  onItemSelect?: (index: number) => void;
  direction?: 'ltr' | 'rtl';
  disabled?: boolean;
}

export const RadialScrollGallery = forwardRef<HTMLDivElement, RadialScrollGalleryProps>(
  (
    {
      children,
      scrollDuration = 2500,
      visiblePercentage = 45,
      baseRadius = 550,
      mobileRadius = 220,
      className = '',
      startTrigger = 'top top',
      onItemSelect,
      direction = 'ltr',
      disabled = false,
      ...rest
    },
    ref
  ) => {
    const outerRef     = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLUListElement>(null);
    const childRef     = useRef<HTMLLIElement>(null);
    const mergedRef    = useMergeRefs(ref, outerRef);

    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [childSize, setChildSize]       = useState<{ w: number; h: number } | null>(null);
    const [isMounted, setIsMounted]       = useState(false);

    const currentRadius  = useResponsiveValue(baseRadius, mobileRadius);
    const circleDiameter = currentRadius * 2;

    const { visibleDecimal, hiddenDecimal } = useMemo(() => {
      const v = Math.max(0.1, Math.min(1, visiblePercentage / 100));
      return { visibleDecimal: v, hiddenDecimal: 1 - v };
    }, [visiblePercentage]);

    const childrenNodes = useMemo(
      () => React.Children.toArray(children(hoveredIndex)),
      [children, hoveredIndex]
    );
    const childrenCount = childrenNodes.length;

    // Measure first card via ResizeObserver
    useEffect(() => {
      setIsMounted(true);
      if (!childRef.current) return;
      const observer = new ResizeObserver(() => {
        if (childRef.current) {
          setChildSize({
            w: childRef.current.offsetWidth,
            h: childRef.current.offsetHeight,
          });
        }
        requestAnimationFrame(() => ScrollTrigger.refresh());
      });
      observer.observe(childRef.current);
      return () => observer.disconnect();
    }, [childrenCount]);

    // GSAP animations using project's hook (same instance + context as all other sections)
    useGSAP(
      () => {
        if (!outerRef.current || !containerRef.current || childrenCount === 0) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const wheel     = containerRef.current;
        const cardInners = gsap.utils.toArray<HTMLElement>('.card-inner', wheel);

        const triggerCfg = {
          trigger: outerRef.current,
          start: startTrigger,
          end: `+=${scrollDuration}`,
          scrub: 1.5,
          invalidateOnRefresh: true,
        };

        // Wheel rotates 360°
        gsap.to(wheel, {
          rotation: 360,
          ease: 'none',
          scrollTrigger: triggerCfg,
        });

        // Each card counter-rotates –360° so it always faces the viewer
        if (cardInners.length) {
          gsap.to(cardInners, {
            rotation: -360,
            ease: 'none',
            scrollTrigger: triggerCfg,
          });
        }

        // Initial entrance: cards scale in from 0
        gsap.fromTo(
          wheel.children,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 1.2,
            ease: 'back.out(1.2)',
            stagger: 0.05,
            scrollTrigger: {
              trigger: outerRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      },
      [scrollDuration, currentRadius, startTrigger, childrenCount],
      outerRef
    );

    if (childrenCount === 0) return null;

    const buffer         = childSize ? childSize.h * 0.25 + 80 : 150;
    const visibleAreaH   = childSize
      ? circleDiameter * visibleDecimal + childSize.h / 2 + buffer
      : circleDiameter * visibleDecimal + 200;

    return (
      // Tall outer wrapper — CSS sticky does the viewport pinning, no GSAP pin
      <div
        ref={mergedRef}
        className={`relative w-full ${className}`}
        style={{ minHeight: `${scrollDuration + visibleAreaH}px` }}
        {...rest}
      >
        {/* Sticky inner frame */}
        <div
          className="sticky top-0 w-full overflow-hidden"
          style={{
            height: `${visibleAreaH}px`,
            maskImage: 'linear-gradient(to top, transparent 0%, black 35%, black 100%)',
            WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 35%, black 100%)',
          }}
        >
          <ul
            ref={containerRef}
            dir={direction}
            className={[
              'absolute left-1/2 m-0 list-none p-0 -translate-x-1/2',
              disabled ? 'pointer-events-none grayscale opacity-50' : '',
            ].join(' ')}
            style={{
              width: circleDiameter,
              height: circleDiameter,
              bottom: -(circleDiameter * hiddenDecimal),
              opacity: isMounted ? 1 : 0,
              transition: 'opacity 0.5s ease',
              willChange: 'transform',
            }}
          >
            {childrenNodes.map((child, index) => {
              const angle = (index / childrenCount) * 2 * Math.PI;
              let x = currentRadius * Math.cos(angle);
              const y = currentRadius * Math.sin(angle);
              if (direction === 'rtl') x = -x;

              const isHovered    = hoveredIndex === index;
              const isAnyHovered = hoveredIndex !== null;

              return (
                <li
                  key={index}
                  ref={index === 0 ? childRef : null}
                  className="absolute left-1/2 top-1/2"
                  style={{
                    // Positioning only — GSAP never touches this transform
                    transform: `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0)`,
                    zIndex: isHovered ? 100 : 10,
                  }}
                >
                  {/* GSAP controls rotation on this wrapper — React doesn't touch it */}
                  <div className="card-inner" style={{ willChange: 'transform' }}>
                    <div
                      role="button"
                      tabIndex={disabled ? -1 : 0}
                      onClick={() => !disabled && onItemSelect?.(index)}
                      onKeyDown={(e) => {
                        if (disabled) return;
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onItemSelect?.(index);
                        }
                      }}
                      onMouseEnter={() => !disabled && setHoveredIndex(index)}
                      onMouseLeave={() => !disabled && setHoveredIndex(null)}
                      onFocus={() => !disabled && setHoveredIndex(index)}
                      onBlur={() => !disabled && setHoveredIndex(null)}
                      className={[
                        'block cursor-pointer rounded-xl text-left outline-none',
                        'focus-visible:ring-2 focus-visible:ring-yolk focus-visible:ring-offset-2',
                        'transition-all duration-500 ease-out will-change-transform',
                        isHovered ? 'scale-125 -translate-y-8' : 'scale-100',
                        isAnyHovered && !isHovered
                          ? 'opacity-40 blur-[2px] grayscale'
                          : 'opacity-100 blur-0',
                      ].join(' ')}
                    >
                      {child}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
);

RadialScrollGallery.displayName = 'RadialScrollGallery';
