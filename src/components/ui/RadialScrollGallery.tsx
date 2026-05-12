import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap-config';
import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import type { HTMLAttributes, ReactNode, Ref } from 'react';

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
    const debounced = () => { clearTimeout(id); id = setTimeout(handleResize, 100); };
    window.addEventListener('resize', debounced);
    return () => { window.removeEventListener('resize', debounced); clearTimeout(id); };
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
      const clamped = Math.max(10, Math.min(100, visiblePercentage));
      const v = clamped / 100;
      return { visibleDecimal: v, hiddenDecimal: 1 - v };
    }, [visiblePercentage]);

    const childrenNodes = useMemo(
      () => React.Children.toArray(children(hoveredIndex)),
      [children, hoveredIndex]
    );
    const childrenCount = childrenNodes.length;

    // Measure first card after mount
    useEffect(() => {
      setIsMounted(true);
      if (!childRef.current) return;
      const observer = new ResizeObserver(() => {
        if (childRef.current) {
          setChildSize({ w: childRef.current.offsetWidth, h: childRef.current.offsetHeight });
        }
        // Defer refresh so DOM has updated before ScrollTrigger recalculates
        requestAnimationFrame(() => ScrollTrigger.refresh());
      });
      observer.observe(childRef.current);
      return () => observer.disconnect();
    }, [childrenCount]);

    useGSAP(
      () => {
        if (!outerRef.current || !containerRef.current || childrenCount === 0) return;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        const triggerConfig = {
          trigger: outerRef.current,
          start: startTrigger,
          end: `+=${scrollDuration}`,
          scrub: 1.5,
          invalidateOnRefresh: true,
        };

        // 1. Wheel rotates 360° driven by scroll
        gsap.to(containerRef.current, {
          rotation: 360,
          ease: 'none',
          scrollTrigger: triggerConfig,
        });

        // 2. Each card counter-rotates -360° to stay upright
        // Uses .card-inner wrapper so GSAP doesn't conflict with React's <li> positioning transform
        const cardInners = containerRef.current.querySelectorAll('.card-inner');
        if (cardInners.length) {
          gsap.to(cardInners, {
            rotation: -360,
            ease: 'none',
            scrollTrigger: triggerConfig,
          });
        }

        // 3. Initial reveal animation
        gsap.fromTo(
          containerRef.current.children,
          { scale: 0, opacity: 0 },
          {
            scale: 1, opacity: 1, duration: 1.2, ease: 'back.out(1.2)', stagger: 0.05,
            scrollTrigger: {
              trigger: outerRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      },
      { scope: outerRef, dependencies: [scrollDuration, currentRadius, startTrigger, childrenCount] }
    );

    if (childrenCount === 0) return null;

    const calculatedBuffer = childSize ? childSize.h * 0.25 + 80 : 150;
    const visibleAreaHeight = childSize
      ? circleDiameter * visibleDecimal + childSize.h / 2 + calculatedBuffer
      : circleDiameter * visibleDecimal + 200;

    return (
      // Outer tall wrapper — scroll happens here, CSS sticky does the "pinning"
      <div
        ref={mergedRef}
        className={`relative w-full ${className}`}
        style={{ minHeight: `${scrollDuration + visibleAreaHeight}px` }}
        {...rest}
      >
        {/* Sticky frame — stays in viewport while outer wrapper scrolls */}
        <div
          className="sticky top-0 w-full overflow-hidden"
          style={{
            height: `${visibleAreaHeight}px`,
            maskImage: 'linear-gradient(to top, transparent 0%, black 35%, black 100%)',
            WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 35%, black 100%)',
          }}
        >
          <ul
            ref={containerRef}
            dir={direction}
            className={[
              'absolute left-1/2 m-0 list-none p-0 will-change-transform -translate-x-1/2',
              disabled ? 'pointer-events-none grayscale opacity-50' : '',
              isMounted ? 'opacity-100' : 'opacity-0',
            ].join(' ')}
            style={{
              width: circleDiameter,
              height: circleDiameter,
              bottom: -(circleDiameter * hiddenDecimal),
              transition: 'opacity 0.5s ease',
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
                  {/* card-inner: GSAP animates counter-rotation here, React doesn't touch it */}
                  <div className="card-inner" style={{ willChange: 'transform' }}>
                    <div
                      role="button"
                      tabIndex={disabled ? -1 : 0}
                      onClick={() => !disabled && onItemSelect?.(index)}
                      onKeyDown={(e) => {
                        if (disabled) return;
                        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onItemSelect?.(index); }
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
                        isAnyHovered && !isHovered ? 'opacity-40 blur-[2px] grayscale' : 'opacity-100 blur-0',
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
