import { useRef } from 'react';
import { useGSAP } from '@/hooks/useGSAP';
import { gsap } from '@/lib/gsap-config';
import { useProducts } from '@/hooks/useProducts';
import { useAppStore } from '@/stores/useAppStore';
import { ProductCard } from '@/components/ProductCard';
import { OliveOilBottle } from '@/components/illustrations/OliveOilBottle';
import { WineBottle } from '@/components/illustrations/WineBottle';
import { HoneyJar } from '@/components/illustrations/HoneyJar';
import { NutsJar } from '@/components/illustrations/NutsJar';
import { YerbaPackage } from '@/components/illustrations/YerbaPackage';
import { SparkleDecoration } from '@/components/illustrations/SparkleDecoration';
import { FloatingIllustration } from '@/components/illustrations/FloatingIllustration';
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

  const wineRef = useRef<HTMLDivElement>(null);
  const oliveRef = useRef<HTMLDivElement>(null);
  const honeyRef = useRef<HTMLDivElement>(null);
  const nutsRef = useRef<HTMLDivElement>(null);
  const yerbaRef = useRef<HTMLDivElement>(null);

  const { products, isLoading } = useProducts();
  const addToOrder = useAppStore((state) => state.addToOrder);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      // ── Cards del catálogo ──
      const grid = gridRef.current;
      if (grid && products.length) {
        const cards = grid.querySelectorAll('.product-card');
        if (cards.length) {
          gsap.from(cards, {
            scrollTrigger: {
              trigger: grid,
              start: SCROLL_TRIGGER_START,
            },
            y: CARD_REVEAL_Y,
            opacity: 0,
            rotateX: CARD_REVEAL_ROTATE_X,
            stagger: { amount: STAGGER_CARD_REVEAL, from: 'start' },
            duration: CARD_REVEAL_DURATION,
            ease: 'power3.out',
          });
        }
      }

      // ── Reveal de ilustraciones: solo y / opacity / scale (sin x, para no conflictuar con el parallax) ──
      const revealIllustration = (
        el: HTMLDivElement | null,
        triggerStart: string,
        delay = 0
      ) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { y: 40, opacity: 0, scale: 0.85 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.1,
            delay,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: triggerStart, once: true },
          }
        );
      };

      revealIllustration(wineRef.current,  'top 92%', 0);
      revealIllustration(oliveRef.current, 'top 92%', 0.15);
      revealIllustration(honeyRef.current, 'top 92%', 0.1);
      revealIllustration(nutsRef.current,  'top 92%', 0.2);

      // Yerba: trigger en la sección por estar posicionada con bottom
      const yerba = yerbaRef.current;
      if (yerba) {
        gsap.fromTo(
          yerba,
          { y: 40, opacity: 0, scale: 0.85 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.1,
            delay: 0.05,
            ease: 'power3.out',
            scrollTrigger: { trigger: section, start: '60% 100%', once: true },
          }
        );
      }

      // ── Parallax horizontal con scroll — direcciones alternadas ──
      const scrollParallax = (el: HTMLDivElement | null, fromX: number, toX: number) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { x: fromX },
          {
            x: toX,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.5,
            },
          }
        );
      };

      scrollParallax(wineRef.current,  -140,  140);  // →
      scrollParallax(oliveRef.current,  120, -120);  // ←
      scrollParallax(honeyRef.current, -100,  100);  // →
      scrollParallax(nutsRef.current,   130, -130);  // ←
      scrollParallax(yerbaRef.current, -120,  120);  // →
    },
    [products],
    sectionRef
  );

  const handleAddToOrder = (product: Product) => {
    addToOrder(product);
  };

  const getColSpan = (index: number): string => {
    const pairIndex = Math.floor(index / 2);
    const isFirstInPair = index % 2 === 0;
    const isEvenPair = pairIndex % 2 === 0;
    if (isEvenPair) {
      return isFirstInPair ? 'lg:col-span-7' : 'lg:col-span-5';
    }
    return isFirstInPair ? 'lg:col-span-5' : 'lg:col-span-7';
  };

  const getVariant = (product: Product): 'featured' | 'standard' => {
    if (product.is_featured) return 'featured';
    return 'standard';
  };

  return (
    <section
      ref={sectionRef}
      id="products"
      className="products-section relative bg-bg-primary py-[300px]"
      aria-label="Nuestros productos"
    >
      {/* ══════════════════════════════════════
          ILUSTRACIONES — dispersas por toda la sección
          ══════════════════════════════════════ */}

      {/* Botella de vino — izquierda superior */}
      <div
        ref={wineRef}
        className="pointer-events-none absolute left-[3%] top-[50px] z-0 hidden w-[100px] select-none
                   lg:block lg:w-[120px] xl:w-[140px]"
      >
        <FloatingIllustration floatY={14} duration={4.8} rotateZ={1.5}>
          <WineBottle />
        </FloatingIllustration>
      </div>

      {/* Botella de aceite — derecha superior */}
      <div
        ref={oliveRef}
        className="pointer-events-none absolute right-[4%] top-[90px] z-0 hidden w-[80px] select-none
                   lg:block lg:w-[95px] xl:w-[110px]"
      >
        <FloatingIllustration floatY={18} duration={5.2} rotateZ={-2} delay={0.4}>
          <OliveOilBottle />
        </FloatingIllustration>
      </div>

      {/* Frasco de miel — centro-derecha, zona alta */}
      <div
        ref={honeyRef}
        className="pointer-events-none absolute left-[52%] top-[40px] z-0 hidden w-[110px] select-none
                   lg:block lg:w-[130px] xl:w-[150px]"
      >
        <FloatingIllustration floatY={12} duration={4.2} delay={0.6}>
          <HoneyJar />
        </FloatingIllustration>
      </div>

      {/* Frasco de frutos secos — izquierda, zona media-baja */}
      <div
        ref={nutsRef}
        className="pointer-events-none absolute left-[8%] top-[580px] z-0 hidden w-[90px] select-none
                   lg:block lg:w-[106px] xl:w-[120px]"
      >
        <FloatingIllustration floatY={16} duration={4.6} rotateZ={2} delay={0.3}>
          <NutsJar />
        </FloatingIllustration>
      </div>

      {/* Paquete de yerba — fondo de sección, más centrado */}
      <div
        ref={yerbaRef}
        className="pointer-events-none absolute bottom-[60px] left-[28%] z-0 hidden w-[100px] select-none
                   lg:block lg:w-[116px] xl:w-[132px]"
      >
        <FloatingIllustration floatY={13} duration={4.4} rotateZ={-1.5} delay={0.5}>
          <YerbaPackage />
        </FloatingIllustration>
      </div>

      {/* Sparkles */}
      <SparkleDecoration
        className="pointer-events-none absolute left-[48%] top-[22%] z-0 hidden w-[18px] select-none opacity-40 lg:block"
        color="#F59E0B"
      />
      <SparkleDecoration
        className="pointer-events-none absolute left-[20%] top-[15%] z-0 hidden w-[14px] select-none opacity-30 lg:block"
        color="#F59E0B"
        variant="cross"
      />
      <SparkleDecoration
        className="pointer-events-none absolute right-[22%] top-[55%] z-0 hidden w-[16px] select-none opacity-35 lg:block"
        color="#F0EAD6"
        variant="dot"
      />
      <SparkleDecoration
        className="pointer-events-none absolute left-[35%] top-[78%] z-0 hidden w-[18px] select-none opacity-25 lg:block"
        color="#F59E0B"
        variant="star4"
      />

      {/* ══════════════════════════════════════
          CONTENIDO PRINCIPAL
          ══════════════════════════════════════ */}
      <div className="relative z-10 mx-auto max-w-7xl px-6">

        {/* Section header */}
        <div className="mb-16">
          <p className="font-mono text-xs uppercase tracking-widest text-yolk">
            Catálogo
          </p>
          <h2 className="mt-3 font-heading text-section text-text-primary">
            Nuestros Productos
          </h2>
          <p className="mt-4 max-w-lg font-body text-body text-text-secondary">
            Selección curada de huevos premium. Cada variedad elegida por su calidad
            excepcional, origen trazable y sabor incomparable.
          </p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-yolk border-t-transparent" />
          </div>
        )}

        {/* Grid de productos */}
        {!isLoading && products.length > 0 && (
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

        {/* Empty */}
        {/* {!isLoading && products.length === 0 && (
          <div className="rounded-xl bg-bg-elevated p-8 text-center">
            <p className="font-body text-text-secondary">
              No hay productos disponibles en este momento.
            </p>
          </div>
        )} */}

      </div>
    </section>
  );
}
