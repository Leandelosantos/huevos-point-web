import { useRef } from 'react';
import { useGSAP } from '@/hooks/useGSAP';
import { gsap } from '@/lib/gsap-config';
import { useProducts } from '@/hooks/useProducts';
import { useAppStore } from '@/stores/useAppStore';
import { ProductCard } from '@/components/ProductCard';
import type { Product } from '@/types';
import {
  CARD_REVEAL_Y,
  CARD_REVEAL_ROTATE_X,
  STAGGER_CARD_REVEAL,
  CARD_REVEAL_DURATION,
  SCROLL_TRIGGER_START,
} from '@/constants/animation';

export function ProductsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const { products, isLoading, error } = useProducts();
  const addToOrder = useAppStore((state) => state.addToOrder);

  useGSAP(
    () => {
      const grid = gridRef.current;
      if (!grid || !products.length) return;

      const cards = grid.querySelectorAll('.product-card');
      if (!cards.length) return;

      gsap.from(cards, {
        scrollTrigger: {
          trigger: grid,
          start: SCROLL_TRIGGER_START,
        },
        y: CARD_REVEAL_Y,
        opacity: 0,
        rotateX: CARD_REVEAL_ROTATE_X,
        stagger: {
          amount: STAGGER_CARD_REVEAL,
          from: 'start',
        },
        duration: CARD_REVEAL_DURATION,
        ease: 'power3.out',
      });
    },
    [products],
    sectionRef
  );

  const handleAddToOrder = (product: Product) => {
    addToOrder(product);
  };

  // Asymmetric grid: pairs of (large 7col + small 5col), alternating direction
  const getColSpan = (index: number): string => {
    const pairIndex = Math.floor(index / 2);
    const isFirstInPair = index % 2 === 0;
    const isEvenPair = pairIndex % 2 === 0;
    // Even pairs: large-left, small-right. Odd pairs: small-left, large-right
    if (isEvenPair) {
      return isFirstInPair ? 'lg:col-span-7' : 'lg:col-span-5';
    }
    return isFirstInPair ? 'lg:col-span-5' : 'lg:col-span-7';
  };

  const getVariant = (product: Product): 'featured' | 'standard' | 'compact' => {
    if (product.is_featured) return 'featured';
    return 'standard';
  };

  return (
    <section
      ref={sectionRef}
      id="products"
      className="products-section bg-bg-primary py-section"
      aria-label="Nuestros productos"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="mb-16">
          <p className="font-mono text-xs uppercase tracking-widest text-yolk">
            Cat\u00e1logo
          </p>
          <h2 className="mt-3 font-heading text-section text-text-primary">
            Nuestros Productos
          </h2>
          <p className="mt-4 max-w-lg font-body text-body text-text-secondary">
            Selecci\u00f3n curada de huevos premium. Cada variedad elegida por su calidad excepcional, origen trazable y sabor incomparable.
          </p>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-yolk border-t-transparent" />
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="rounded-xl bg-bg-elevated p-8 text-center">
            <p className="font-body text-text-secondary">
              No pudimos cargar los productos. Intent\u00e1 de nuevo m\u00e1s tarde.
            </p>
          </div>
        )}

        {/* Products grid — asymmetric 60/40 on desktop, 2-col tablet, stack mobile */}
        {!isLoading && !error && products.length > 0 && (
          <div
            ref={gridRef}
            className="products-grid grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-12"
          >
            {products.map((product, index) => (
              <div key={product.id} className={`col-span-1 ${getColSpan(index)}`}>
                <ProductCard
                  product={product}
                  variant={getVariant(product)}
                  onAddToOrder={handleAddToOrder}
                />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && products.length === 0 && (
          <div className="rounded-xl bg-bg-elevated p-8 text-center">
            <p className="font-body text-text-secondary">
              No hay productos disponibles en este momento.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
