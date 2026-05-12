import { useRef } from 'react';
import { useGSAP } from '@/hooks/useGSAP';
import { gsap, ScrollTrigger } from '@/lib/gsap-config';
import { WHATSAPP_NUMBER } from '@/constants/business';
import { OliveOilBottle } from '@/components/illustrations/OliveOilBottle';
import { WineBottle } from '@/components/illustrations/WineBottle';
import { HoneyJar } from '@/components/illustrations/HoneyJar';
import { NutsJar } from '@/components/illustrations/NutsJar';
import { YerbaPackage } from '@/components/illustrations/YerbaPackage';
import { SparkleDecoration } from '@/components/illustrations/SparkleDecoration';
import { FloatingIllustration } from '@/components/illustrations/FloatingIllustration';
import { RadialScrollGallery } from '@/components/ui/RadialScrollGallery';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';

interface GalleryProduct {
  id: string;
  name: string;
  category: string;
  price: string;
  imageSrc: string;
}

const GALLERY_PRODUCTS: GalleryProduct[] = [
  { id: '1', name: 'Huevo N·3',    category: 'El mas chico',   price: '',  imageSrc: 'images/products/n3.png' },
  { id: '2', name: 'Huevo N·2',   category: 'Pequeño y poderoso',   price: '',  imageSrc: '/images/products/avocado.png' },
  { id: '3', name: 'Huevo N·1',     category: 'El hermano del medio', price: '',  imageSrc: '/images/products/mapleBlanco.png' },
  { id: '4', name: 'Huevo Super',     category: 'El Huevo Estrella',   price: '',  imageSrc: '/images/products/super.png' },
  { id: '5', name: 'Huevo Jumbo',          category: 'Doble Yema !',  price: '',  imageSrc: '/images/products/dobleYema.png' },
  { id: '6', name: 'Huevo Color',     category: 'El distinto',    price: '',  imageSrc: '/images/products/color.png' },
];

export function ProductsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const wineRef    = useRef<HTMLDivElement>(null);
  const oliveRef   = useRef<HTMLDivElement>(null);
  const honeyRef   = useRef<HTMLDivElement>(null);
  const nutsRef    = useRef<HTMLDivElement>(null);
  const yerbaRef   = useRef<HTMLDivElement>(null);

  const whatsappUrl = (productName: string) =>
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hola! Me interesa: ${productName}`)}`;

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const revealIllustration = (el: HTMLDivElement | null, triggerStart: string, delay = 0) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { y: 40, opacity: 0, scale: 0.85 },
          { y: 0, opacity: 1, scale: 1, duration: 1.1, delay, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: triggerStart, once: true } }
        );
      };

      revealIllustration(wineRef.current,  'top 92%', 0);
      revealIllustration(oliveRef.current, 'top 92%', 0.15);
      revealIllustration(honeyRef.current, 'top 92%', 0.1);
      revealIllustration(nutsRef.current,  'top 92%', 0.2);

      const yerba = yerbaRef.current;
      if (yerba) {
        gsap.fromTo(yerba, { y: 40, opacity: 0, scale: 0.85 },
          { y: 0, opacity: 1, scale: 1, duration: 1.1, delay: 0.05, ease: 'power3.out',
            scrollTrigger: { trigger: section, start: '60% 100%', once: true } });
      }

      const scrollParallax = (el: HTMLDivElement | null, fromX: number, toX: number) => {
        if (!el) return;
        gsap.fromTo(el, { x: fromX }, { x: toX, ease: 'none',
          scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 0.5 } });
      };

      scrollParallax(wineRef.current,  -140,  140);
      scrollParallax(oliveRef.current,  120, -120);
      scrollParallax(honeyRef.current, -100,  100);
      scrollParallax(nutsRef.current,   130, -130);
      scrollParallax(yerbaRef.current, -120,  120);

      // Recalcula posiciones de todos los ScrollTriggers después de que StorySection haya agregado su spacer de pin
      ScrollTrigger.refresh();
    },
    [],
    sectionRef
  );

  return (
    <section
      ref={sectionRef}
      id="products"
      className="products-section relative bg-bg-primary"
      aria-label="Nuestros productos"
    >
      {/* ── Ilustraciones decorativas ── */}
      <div ref={wineRef} className="pointer-events-none absolute left-[3%] top-[50px] z-0 hidden w-[100px] select-none lg:block lg:w-[120px] xl:w-[140px]">
        <FloatingIllustration floatY={14} duration={4.8} rotateZ={1.5}><WineBottle /></FloatingIllustration>
      </div>
      <div ref={oliveRef} className="pointer-events-none absolute right-[4%] top-[90px] z-0 hidden w-[80px] select-none lg:block lg:w-[95px] xl:w-[110px]">
        <FloatingIllustration floatY={18} duration={5.2} rotateZ={-2} delay={0.4}><OliveOilBottle /></FloatingIllustration>
      </div>
      <div ref={honeyRef} className="pointer-events-none absolute left-[52%] top-[40px] z-0 hidden w-[110px] select-none lg:block lg:w-[130px] xl:w-[150px]">
        <FloatingIllustration floatY={12} duration={4.2} delay={0.6}><HoneyJar /></FloatingIllustration>
      </div>
      <div ref={nutsRef} className="pointer-events-none absolute left-[8%] top-[580px] z-0 hidden w-[90px] select-none lg:block lg:w-[106px] xl:w-[120px]">
        <FloatingIllustration floatY={16} duration={4.6} rotateZ={2} delay={0.3}><NutsJar /></FloatingIllustration>
      </div>
      <div ref={yerbaRef} className="pointer-events-none absolute bottom-[60px] left-[28%] z-0 hidden w-[100px] select-none lg:block lg:w-[116px] xl:w-[132px]">
        <FloatingIllustration floatY={13} duration={4.4} rotateZ={-1.5} delay={0.5}><YerbaPackage /></FloatingIllustration>
      </div>

      <SparkleDecoration className="pointer-events-none absolute left-[48%] top-[22%] z-0 hidden w-[18px] select-none opacity-40 lg:block" color="#fd904a" />
      <SparkleDecoration className="pointer-events-none absolute left-[20%] top-[15%] z-0 hidden w-[14px] select-none opacity-30 lg:block" color="#fd904a" variant="cross" />
      <SparkleDecoration className="pointer-events-none absolute right-[22%] top-[55%] z-0 hidden w-[16px] select-none opacity-35 lg:block" color="#fff2d9" variant="dot" />
      <SparkleDecoration className="pointer-events-none absolute left-[35%] top-[78%] z-0 hidden w-[18px] select-none opacity-25 lg:block" color="#fd904a" variant="star4" />

      {/* ── Contenido principal ── */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-24">
        <p className="font-mono text-xs uppercase tracking-widest text-yolk">Catálogo</p>
        <h2 className="mt-3 font-heading text-section text-text-primary">Nuestros Productos</h2>
        <p className="mt-4 max-w-lg font-body text-body text-text-secondary">
          Selección curada de huevos premium. Cada variedad elegida por su calidad
          excepcional, origen trazable y sabor incomparable.
        </p>
      </div>

      {/* ── Galería radial ── */}
      <RadialScrollGallery
        baseRadius={600}
        mobileRadius={320}
        visiblePercentage={48}
        scrollDuration={2200}
        startTrigger="top top"
        onItemSelect={(index) => {
          const p = GALLERY_PRODUCTS[index];
          if (p) window.open(whatsappUrl(p.name), '_blank', 'noopener,noreferrer');
        }}
      >
        {(hoveredIndex) =>
          GALLERY_PRODUCTS.map((product, index) => {
            const isActive = hoveredIndex === index;
            return (
              <div
                key={product.id}
                className="relative h-[400px] w-[280px] overflow-hidden rounded-2xl sm:h-[460px] sm:w-[320px]"
                style={{ backgroundColor: 'var(--color-bg-elevated)' }}
              >
                {/* Imagen — src vacío para que el usuario lo llene */}
                <div className="absolute inset-0 overflow-hidden">
                  {product.imageSrc ? (
                    <img
                      src={product.imageSrc}
                      alt={product.name}
                      className={`h-full w-full object-cover transition-transform duration-700 ease-out ${
                        isActive ? 'scale-110' : 'scale-100 grayscale-[20%]'
                      }`}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center" style={{ backgroundColor: 'var(--color-bg-elevated)' }}>
                      <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
                        sin imagen
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                </div>

                {/* Contenido de la card */}
                <div className="absolute inset-0 flex flex-col justify-between p-4">
                  <div className="flex items-start justify-between">
                    <Badge variant="secondary" className="text-[14px] backdrop-blur-sm" style={{ backgroundColor: 'rgba(2,12,30,0.75)', color: 'var(--color-text-secondary)', border: '1px solid rgba(255,242,217,0.15)' }}>
                      {product.category}
                    </Badge>
                    <div className={`flex h-6 w-6 items-center justify-center rounded-full transition-all duration-500 ${isActive ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-45'}`}
                      style={{ backgroundColor: 'var(--color-yolk)', color: 'var(--color-bg-primary)' }}>
                      <ShoppingCart size={11} />
                    </div>
                  </div>

                  <div className={`transition-transform duration-500 ${isActive ? 'translate-y-0' : 'translate-y-2'}`}>
                    {product.price && (
                      <p className="font-mono text-xs" style={{ color: 'var(--color-yolk)' }}>{product.price}</p>
                    )}
                    <h3 className="mt-1 font-display text-xl font-bold leading-tight" style={{ color: 'var(--color-text-primary)' }}>
                      {product.name}
                    </h3>
                    <div className={`mt-2 h-0.5 transition-all duration-500 ${isActive ? 'w-full opacity-100' : 'w-0 opacity-0'}`}
                      style={{ backgroundColor: 'var(--color-yolk)' }} />
                  </div>
                </div>
              </div>
            );
          })
        }
      </RadialScrollGallery>
    </section>
  );
}
