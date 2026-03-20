import { useRef, useState, useCallback } from 'react';
import { ShoppingBag } from 'lucide-react';
import { gsap, Flip } from '@/lib/gsap-config';
import { usePrefersReducedMotion, useIsMobile } from '@/hooks/useMediaQuery';
import { formatPrice, formatUnit, cn } from '@/lib/utils';
import type { ProductCardProps } from '@/types';
import {
  CARD_HOVER_SCALE,
  CARD_HOVER_IMAGE_SCALE,
  CARD_HOVER_SHADOW_SPREAD,
  CARD_HOVER_DURATION,
  CARD_LEAVE_DURATION,
  CARD_PRICE_BOUNCE_Y,
  CARD_PRICE_BOUNCE_EASE,
  CARD_DESCRIPTION_REVEAL_DURATION,
} from '@/constants/animation';

export function ProductCard({ product, variant, onAddToOrder }: ProductCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const prefersReducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  // ─── Desktop hover: mouseenter ───
  const handleMouseEnter = useCallback(() => {
    if (prefersReducedMotion || isMobile || !product.is_available) return;
    const card = cardRef.current;
    if (!card) return;

    // Scale card + shadow
    gsap.to(card, {
      scale: CARD_HOVER_SCALE,
      boxShadow: `0 ${CARD_HOVER_SHADOW_SPREAD * 2}px ${CARD_HOVER_SHADOW_SPREAD * 4}px rgba(0,0,0,0.3)`,
      duration: CARD_HOVER_DURATION,
      ease: 'power2.out',
    });

    // Scale image
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        scale: CARD_HOVER_IMAGE_SCALE,
        duration: CARD_HOVER_DURATION,
        ease: 'power2.out',
      });
    }

    // Price badge bounce
    if (badgeRef.current) {
      gsap.fromTo(
        badgeRef.current,
        { y: CARD_PRICE_BOUNCE_Y },
        { y: 0, duration: 0.3, ease: CARD_PRICE_BOUNCE_EASE }
      );
    }

    // Reveal description with Flip
    if (descriptionRef.current && !isExpanded) {
      const state = Flip.getState(descriptionRef.current);
      descriptionRef.current.style.height = 'auto';
      descriptionRef.current.style.opacity = '1';
      Flip.from(state, {
        duration: CARD_DESCRIPTION_REVEAL_DURATION,
        ease: 'power3.out',
      });
      setIsExpanded(true);
    }
  }, [prefersReducedMotion, isMobile, product.is_available, isExpanded]);

  // ─── Desktop hover: mouseleave ───
  const handleMouseLeave = useCallback(() => {
    if (prefersReducedMotion || isMobile) return;
    const card = cardRef.current;
    if (!card) return;

    // Revert scale + shadow
    gsap.to(card, {
      scale: 1,
      boxShadow: '0 0 0 rgba(0,0,0,0)',
      duration: CARD_LEAVE_DURATION,
      ease: 'power2.inOut',
    });

    // Revert image
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        scale: 1,
        duration: CARD_LEAVE_DURATION,
        ease: 'power2.inOut',
      });
    }

    // Hide description
    if (descriptionRef.current) {
      gsap.to(descriptionRef.current, {
        height: 0,
        opacity: 0,
        duration: CARD_LEAVE_DURATION,
        ease: 'power2.inOut',
        onComplete: () => setIsExpanded(false),
      });
    }
  }, [prefersReducedMotion, isMobile]);

  // ─── Mobile: tap to expand, second tap for CTA ───
  const handleTap = useCallback(() => {
    if (!isMobile || !product.is_available) return;

    if (isExpanded) {
      // Second tap → add to order
      onAddToOrder(product);
    } else {
      // First tap → expand
      if (descriptionRef.current) {
        gsap.to(descriptionRef.current, {
          height: 'auto',
          opacity: 1,
          duration: CARD_DESCRIPTION_REVEAL_DURATION,
          ease: 'power3.out',
        });
      }
      setIsExpanded(true);
    }
  }, [isMobile, isExpanded, product, onAddToOrder]);

  const isFeatured = variant === 'featured';
  const isCompact = variant === 'compact';
  const isUnavailable = !product.is_available;

  return (
    <article
      ref={cardRef}
      className={cn(
        'product-card relative overflow-hidden rounded-2xl bg-bg-elevated will-change-transform',
        isUnavailable && 'grayscale pointer-events-none'
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={isMobile ? handleTap : undefined}
      role={isMobile ? 'button' : undefined}
      tabIndex={isMobile ? 0 : undefined}
      aria-label={isMobile ? `${product.name} — toc\u00e1 para ver detalles` : undefined}
    >
      {/* Product image */}
      {product.image_url && (
        <div className={cn(
          'relative overflow-hidden',
          isFeatured ? 'aspect-[16/10]' : isCompact ? 'aspect-[3/2]' : 'aspect-[4/3]'
        )}>
          <div
            ref={imageRef}
            className="absolute inset-0 bg-cover bg-center will-change-transform"
            style={{ backgroundImage: `url(${product.image_url})` }}
            role="img"
            aria-label={product.image_alt ?? product.name}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-bg-elevated/80 to-transparent" />

          {/* Unavailable badge */}
          {isUnavailable && (
            <div className="absolute inset-0 flex items-center justify-center bg-bg-primary/50">
              <span className="rounded-full bg-bg-elevated px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-text-muted">
                Agotado
              </span>
            </div>
          )}

          {/* Category badge */}
          {!isUnavailable && isFeatured && (
            <div className="absolute top-4 left-4">
              <span className="rounded-full bg-yolk/90 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-bg-primary backdrop-blur-sm">
                Destacado
              </span>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className={cn('p-5', isFeatured && 'p-6 lg:p-8')}>
        {/* Header: name + price */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className={cn(
              'font-heading text-text-primary',
              isFeatured ? 'text-2xl lg:text-3xl' : 'text-xl'
            )}>
              {product.name}
            </h3>
            {product.origin && (
              <p className="mt-1 font-mono text-[11px] text-text-muted">
                {product.origin}
              </p>
            )}
          </div>

          <span
            ref={badgeRef}
            className={cn(
              'price-badge flex-shrink-0 rounded-lg bg-bg-primary/50 px-3 py-1.5 font-mono text-sm font-bold text-yolk',
              isUnavailable && 'text-text-muted'
            )}
          >
            {isUnavailable
              ? 'Agotado'
              : formatPrice(product.price)}
          </span>
        </div>

        {/* Unit label */}
        {!isUnavailable && (
          <p className="mt-1 font-mono text-[11px] text-text-muted">
            por {formatUnit(product.unit)}
          </p>
        )}

        {/* Description — hidden by default on desktop, shown on hover via Flip */}
        <div
          ref={descriptionRef}
          className={cn(
            'overflow-hidden',
            // On desktop: start collapsed (animated by GSAP)
            // On mobile when not expanded: collapsed
            !isMobile && 'h-0 opacity-0',
            isMobile && !isExpanded && 'h-0 opacity-0'
          )}
        >
          {product.description && (
            <p className={cn(
              'pt-3 font-body text-sm text-text-secondary',
              isFeatured && 'text-base'
            )}>
              {product.description}
            </p>
          )}

          {/* Nutrition info for featured */}
          {isFeatured && product.nutrition && (
            <div className="mt-3 flex flex-wrap gap-2">
              {Object.entries(product.nutrition).map(([key, value]) => (
                <span
                  key={key}
                  className="rounded-md bg-bg-primary/30 px-2 py-1 font-mono text-[10px] text-text-muted"
                >
                  {key}: {value}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* CTA button */}
        {!isUnavailable && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToOrder(product);
            }}
            className={cn(
              'mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-yolk px-5 py-2.5 font-body text-sm font-bold text-bg-primary transition-colors',
              'hover:bg-yolk-light active:bg-yolk-deep',
              'focus-visible:outline-2 focus-visible:outline-yolk focus-visible:outline-offset-2',
              // On desktop: only visible when hovered (via parent opacity)
              // Actually, keep it always visible for accessibility — animation reveals description, button stays
            )}
          >
            <ShoppingBag className="h-4 w-4" />
            Agregar
          </button>
        )}
      </div>
    </article>
  );
}
