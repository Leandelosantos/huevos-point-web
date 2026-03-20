import { useRef } from 'react';
import { useGSAP } from '@/hooks/useGSAP';
import { gsap, ScrollTrigger } from '@/lib/gsap-config';
import {
  STORY_PIN_SCROLL_DISTANCE,
  STORY_IMAGE_PARALLAX_OFFSET,
} from '@/constants/animation';

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
    title: 'Selecci\u00f3n',
    description:
      'Un proceso de clasificaci\u00f3n riguroso donde cada huevo es inspeccionado a mano. Solo los mejores pasan el control de calidad.',
    imageSrc: '/images/hero/story-selection.webp',
    imageAlt: 'Huevos siendo clasificados por tama\u00f1o y calidad',
    imagePosition: 'center 75%',
    stat: { value: '2.400+', label: 'huevos seleccionados por d\u00eda' },
  },
  {
    title: 'Tu mesa',
    description:
      'Del campo a tu cocina en menos de 24 horas. Frescura, sabor y la tranquilidad de saber exactamente de d\u00f3nde viene tu alimento.',
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
      <div className="hidden h-screen items-center md:flex">
        <div
          ref={trackRef}
          className="story-track flex"
          style={{ width: `${PANELS.length * 100}vw` }}
        >
          {PANELS.map((panel, index) => (
            <div
              key={panel.title}
              className="flex h-screen w-screen flex-shrink-0 items-center px-12 lg:px-24"
            >
              <div className="grid w-full grid-cols-2 items-center gap-12">
                {/* Image side */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-bg-elevated">
                  <div
                    className="story-image absolute inset-0 bg-cover"
                    style={{
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
          </div>
        ))}
      </div>
    </section>
  );
}
