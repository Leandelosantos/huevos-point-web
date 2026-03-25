import { useRef } from 'react';
import { useGSAP } from '@/hooks/useGSAP';
import { gsap, ScrollTrigger } from '@/lib/gsap-config';
import {
  STORY_PIN_SCROLL_DISTANCE,
  STORY_IMAGE_PARALLAX_OFFSET,
} from '@/constants/animation';
import { HenIllustration } from '@/components/illustrations/HenIllustration';
import { EggIllustration } from '@/components/illustrations/EggIllustration';
import { SparkleDecoration } from '@/components/illustrations/SparkleDecoration';
import { FloatingIllustration } from '@/components/illustrations/FloatingIllustration';

interface StoryPanel {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  imagePosition?: string;
  stat?: { value: string; label: string };
}

const PANELS: StoryPanel[] = [
  {
    title: 'Origen',
    description:
      'Cada huevo comienza en granjas sustentables donde las gallinas viven en libertad, con espacio para moverse, alimentarse naturalmente y producir huevos de calidad excepcional.',
    imageSrc: '/images/hero/story-origin.webp',
    imageAlt: 'Granja sustentable con gallinas en libertad',
    imagePosition: 'center center',
  },
  {
    title: 'Selección',
    description:
      'Un proceso de clasificación riguroso donde cada huevo es inspeccionado a mano. Solo los mejores pasan el control de calidad.',
    imageSrc: '/images/hero/story-selection.webp',
    imageAlt: 'Huevos siendo clasificados por tamaño y calidad',
    imagePosition: 'center center',
    stat: { value: '2.400+', label: 'huevos seleccionados por día' },
  },
  {
    title: 'Tu mesa',
    description:
      'Del campo a tu cocina en menos de 24 horas. Frescura, sabor y la tranquilidad de saber exactamente de dónde viene tu alimento.',
    imageSrc: '/images/hero/story-table.webp',
    imageAlt: 'Plato gourmet preparado con huevos frescos',
    imagePosition: 'center center',
  },
];

export function StorySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      ScrollTrigger.matchMedia({
        // Desktop: full horizontal pin
        '(min-width: 1024px)': () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              pin: true,
              start: 'top top',
              end: `+=${STORY_PIN_SCROLL_DISTANCE}%`,
              scrub: 1,
            },
          });

          // Move track horizontally to reveal all 3 panels
          tl.to(track, { xPercent: -66.6, ease: 'none' });

          // Parallax: images move slower than text
          const images = track.querySelectorAll('.story-image');
          tl.to(images, { xPercent: STORY_IMAGE_PARALLAX_OFFSET, ease: 'none' }, 0);

          // Text reveal for each panel
          const texts = track.querySelectorAll('.story-text');
          texts.forEach((text, i) => {
            tl.fromTo(
              text,
              { y: 40, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' },
              i * 0.33
            );
          });
        },

        // Tablet: partial pin with 2 visible panels
        '(min-width: 768px) and (max-width: 1023px)': () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              pin: true,
              start: 'top top',
              end: '+=200%',
              scrub: 1,
            },
          });

          tl.to(track, { xPercent: -66.6, ease: 'none' });
        },

        // Mobile: vertical scroll, no pin
        '(max-width: 767px)': () => {
          const panels = section.querySelectorAll('.story-panel-mobile');
          panels.forEach((panel) => {
            gsap.from(panel, {
              y: 40,
              opacity: 0,
              duration: 0.8,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: panel,
                start: 'top 80%',
              },
            });
          });
        },
      });
    },
    [],
    sectionRef
  );

  return (
    <section
      ref={sectionRef}
      id="story"
      className="story-section overflow-hidden bg-bg-secondary"
      aria-label="Nuestra historia"
    >
      {/* Section header */}
      <div className="px-6 pt-section md:hidden">
        <p className="font-mono text-xs uppercase tracking-widest text-yolk">
          Nuestra historia
        </p>
        <h2 className="mt-3 font-heading text-section text-text-primary">
          No es solo un huevo
        </h2>
      </div>

      {/* Desktop / Tablet: horizontal track */}
      <div className="relative hidden h-screen w-screen items-center overflow-hidden md:flex">
        <div
          ref={trackRef}
          className="story-track flex"
          style={{ width: `${PANELS.length * 100}vw` }}
        >
          {PANELS.map((panel, index) => (
            <div
              key={panel.title}
              className="relative flex h-screen w-screen flex-shrink-0 items-center px-12 lg:px-24"
            >
              {/* ── Ilustración: Gallina en panel Origen ── */}
              {index === 0 && (
                <FloatingIllustration
                  className="pointer-events-none absolute bottom-[-60px] right-[8%] z-0 w-[260px] select-none opacity-90 lg:w-[310px]"
                  floatY={16}
                  duration={4}
                >
                  <HenIllustration />
                </FloatingIllustration>
              )}

              {/* ── Huevos decorativos en panel Selección ── */}
              {index === 1 && (
                <>
                  <FloatingIllustration
                    className="pointer-events-none absolute right-[6%] top-[15%] z-0 w-[88px] select-none opacity-60"
                    floatY={10}
                    duration={3.2}
                    rotateZ={3}
                  >
                    <EggIllustration rotate={-18} variant="outline" />
                  </FloatingIllustration>
                  <FloatingIllustration
                    className="pointer-events-none absolute right-[14%] top-[25%] z-0 w-[56px] select-none opacity-40"
                    floatY={8}
                    duration={2.8}
                    delay={0.6}
                  >
                    <EggIllustration rotate={12} variant="outline" />
                  </FloatingIllustration>
                  <SparkleDecoration
                    className="pointer-events-none absolute right-[4%] top-[55%] w-[28px] select-none opacity-50"
                    color="#F59E0B"
                  />
                  <SparkleDecoration
                    className="pointer-events-none absolute right-[22%] top-[72%] w-[18px] select-none opacity-30"
                    color="#F59E0B"
                    variant="cross"
                  />
                </>
              )}

              {/* ── Sparkles decorativos en panel Tu Mesa ── */}
              {index === 2 && (
                <>
                  <FloatingIllustration
                    className="pointer-events-none absolute bottom-[12%] right-[5%] z-0 w-[110px] select-none opacity-55"
                    floatY={12}
                    duration={3.8}
                    rotateZ={2}
                  >
                    <EggIllustration rotate={20} variant="cream" />
                  </FloatingIllustration>
                  <SparkleDecoration
                    className="pointer-events-none absolute right-[18%] top-[18%] w-[22px] select-none opacity-60"
                    color="#F59E0B"
                  />
                  <SparkleDecoration
                    className="pointer-events-none absolute right-[8%] top-[35%] w-[14px] select-none opacity-40"
                    color="#F0EAD6"
                    variant="dot"
                  />
                </>
              )}

              <div className="relative z-10 grid w-full grid-cols-2 items-center gap-12">
                {/* Image side */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-bg-elevated">
                  <div
                    className="story-image absolute inset-y-0 bg-cover"
                    style={{
                      left: '-25%',
                      right: '-25%',
                      backgroundImage: `url(${panel.imageSrc})`,
                      backgroundPosition: panel.imagePosition ?? 'center center',
                    }}
                    role="img"
                    aria-label={panel.imageAlt}
                  />
                </div>

                {/* Text side */}
                <div className="story-text">
                  <p className="font-mono text-xs uppercase tracking-widest text-yolk">
                    {index === 0 && 'Nuestra historia'}
                    {index > 0 && `0${index + 1}`}
                  </p>
                  <h2 className="mt-3 font-heading text-section text-text-primary">
                    {panel.title}
                  </h2>
                  <p className="mt-4 max-w-md font-body text-body text-text-secondary">
                    {panel.description}
                  </p>
                  {panel.stat && (
                    <div className="mt-8">
                      <span className="font-display text-4xl font-bold text-yolk">
                        {panel.stat.value}
                      </span>
                      <p className="mt-1 font-mono text-xs text-text-muted">
                        {panel.stat.label}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: vertical panels */}
      <div className="flex flex-col gap-16 px-6 py-12 md:hidden">
        {PANELS.map((panel, index) => (
          <div key={panel.title} className="story-panel-mobile">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-bg-elevated">
              <div
                className="absolute inset-0 bg-cover"
                style={{
                  backgroundImage: `url(${panel.imageSrc})`,
                  backgroundPosition: panel.imagePosition ?? 'center center',
                }}
                role="img"
                aria-label={panel.imageAlt}
              />
            </div>
            <div className="mt-6">
              <p className="font-mono text-xs uppercase tracking-widest text-yolk">
                0{index + 1}
              </p>
              <h3 className="mt-2 font-heading text-2xl text-text-primary">
                {panel.title}
              </h3>
              <p className="mt-3 font-body text-body text-text-secondary">
                {panel.description}
              </p>
              {panel.stat && (
                <div className="mt-6">
                  <span className="font-display text-3xl font-bold text-yolk">
                    {panel.stat.value}
                  </span>
                  <p className="mt-1 font-mono text-xs text-text-muted">
                    {panel.stat.label}
                  </p>
                </div>
              )}
            </div>
            {/* Gallina ilustrada solo en panel Origen (mobile) */}
            {index === 0 && (
              <div className="mt-8 flex justify-end pr-4 opacity-85">
                <HenIllustration className="w-[180px]" />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
