import { useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { useGSAP } from "@/hooks/useGSAP";
import { gsap, ScrollTrigger } from "@/lib/gsap-config";
import { cn } from "@/lib/utils";
import { BRANCHES } from "@/constants/business";
import {
  BRANCHES_PIN_SCROLL_DISTANCE,
  BRANCHES_TABLET_SCROLL_DISTANCE,
} from "@/constants/animation";

export function BranchesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [isCardHovered, setIsCardHovered] = useState(false);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      // Dirección invertida respecto a StorySection: el track arranca
      // desplazado a la izquierda (-50%) y vuelve a 0% al scrollear,
      // es decir se mueve hacia la derecha (Story se mueve a la izquierda).
      const reversedTrackTween = (end: string) =>
        gsap.fromTo(
          track,
          { xPercent: -50 },
          {
            xPercent: 0,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              pin: true,
              scrub: 1,
              start: "top top",
              end,
            },
          },
        );

      ScrollTrigger.matchMedia({
        "(min-width: 1024px)": () => {
          reversedTrackTween(`+=${BRANCHES_PIN_SCROLL_DISTANCE}%`);
        },
        "(min-width: 768px) and (max-width: 1023px)": () => {
          reversedTrackTween(`+=${BRANCHES_TABLET_SCROLL_DISTANCE}%`);
        },
        // Mobile: sin pin ni scrub — fila con scroll horizontal nativo (ver JSX).
      });
    },
    [],
    sectionRef,
  );

  return (
    <section
      ref={sectionRef}
      id="branches"
      className="branches-section relative bg-bg-secondary"
      aria-label="Nuestras sucursales"
    >
      {/* ── Desktop / Tablet: track pinneado, dirección contraria a Story ── */}
      <div className="relative hidden h-screen w-screen items-center overflow-hidden md:flex">
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 top-8 z-20 text-center transition-opacity duration-300 lg:top-12",
            isCardHovered && "opacity-0",
          )}
        >
          {/* Texto directo sobre el panel naranja sin scrim — usar bg-primary (oscuro)
              en vez de yolk/cream para mantener contraste, igual que Marquee sobre bg-yolk.
              Se desvanece con el hover de cualquier card para no tapar la imagen revelada. */}
          <p className="font-mono text-lg uppercase tracking-widest text-bg-primary/70">
            Sucursales
          </p>
          <h2 className="mt-2 font-heading text-8xl text-bg-primary">
            VISITANOS
          </h2>
        </div>

        <div
          ref={trackRef}
          className="branches-track flex"
          style={{ width: `${BRANCHES.length * 100}vw` }}
        >
          {BRANCHES.map((branch, index) => (
            <div
              key={branch.id}
              onMouseEnter={() => setIsCardHovered(true)}
              onMouseLeave={() => setIsCardHovered(false)}
              className={cn(
                "group relative flex h-screen w-screen flex-shrink-0 items-end overflow-hidden bg-yolk",
                index < BRANCHES.length - 1 &&
                  "border-r-[3px] border-r-brand-blue",
              )}
            >
              <img
                src={branch.image}
                alt={branch.imageAlt}
                loading="lazy"
                className="absolute inset-0 h-full w-full scale-100 object-cover opacity-0 transition-all duration-500 ease-out motion-safe:group-hover:scale-105 group-hover:opacity-100 group-hover:will-change-transform"
              />

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />

              <div className="relative z-10 w-full px-6 pb-16 lg:px-16 lg:pb-20">
                <h3 className="font-oswald text-6xl font-bold uppercase tracking-wide text-cream lg:text-8xl">
                  {branch.name}
                </h3>
                <p className="mt-3 flex items-center gap-2 font-oswald text-xl text-cream lg:text-2xl">
                  <MapPin
                    className="h-5 w-5 flex-shrink-0 lg:h-6 lg:w-6"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                  {branch.address}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Mobile: scroll horizontal nativo con snap, sin pin (SRS §6.4.2) ── */}
      <div className="flex flex-col gap-8 py-section md:hidden">
        <div className="px-6">
          <p className="font-mono text-sm uppercase tracking-widest text-yolk">
            Sucursales
          </p>
          <h2 className="mt-3 font-heading text-section text-text-primary">
            VISITANOS
          </h2>
        </div>

        <div
          className="flex overflow-x-auto"
          style={{
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {BRANCHES.map((branch, index) => (
            <div
              key={branch.id}
              className={cn(
                "relative flex h-[70vh] w-[88vw] flex-shrink-0 items-end overflow-hidden bg-yolk",
                index < BRANCHES.length - 1 &&
                  "border-r-[3px] border-r-brand-blue",
              )}
              style={{ scrollSnapAlign: "start" }}
            >
              <img
                src={branch.image}
                alt={branch.imageAlt}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />

              <div className="relative z-10 w-full px-5 pb-8">
                <h3 className="font-oswald text-4xl font-bold uppercase tracking-wide text-cream">
                  {branch.name}
                </h3>
                <p className="mt-2 flex items-center gap-2 font-oswald text-base text-cream">
                  <MapPin
                    className="h-4 w-4 flex-shrink-0"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                  {branch.address}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="px-6 text-center font-mono text-[10px] uppercase tracking-widest text-text-muted">
          deslizá para ver más →
        </p>
      </div>
    </section>
  );
}
