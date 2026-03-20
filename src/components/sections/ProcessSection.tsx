import { useRef } from 'react';
import { Egg, Search, Package, Truck } from 'lucide-react';
import { useGSAP } from '@/hooks/useGSAP';
import { gsap, ScrollTrigger } from '@/lib/gsap-config';
import { PROCESS_STEPS } from '@/constants/business';
import {
  PROCESS_STEP_FADE_IN_Y,
  PROCESS_STEP_FADE_OUT_Y,
} from '@/constants/animation';

const STEP_ICONS = [Egg, Search, Package, Truck];

export function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      ScrollTrigger.matchMedia({
        // Desktop: full pin with stepper
        '(min-width: 1024px)': () => {
          const steps = gsap.utils.toArray<HTMLElement>('.process-step');

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              pin: true,
              scrub: 0.5,
              start: 'top top',
              end: `+=${steps.length * 100}%`,
            },
          });

          steps.forEach((step, i) => {
            // Fade in
            tl.fromTo(
              step,
              { opacity: 0, y: PROCESS_STEP_FADE_IN_Y },
              { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
            );

            // Animate step counter via text content
            const counter = step.querySelector('.step-counter');
            if (counter) {
              tl.to(
                counter,
                {
                  text: { value: PROCESS_STEPS[i].number },
                  duration: 0.3,
                },
                '<'
              );
            }

            // Hold, then fade out (except last step)
            if (i < steps.length - 1) {
              tl.to(
                step,
                { opacity: 0, y: PROCESS_STEP_FADE_OUT_Y, duration: 0.5 },
                '+=0.5'
              );
            }
          });
        },

        // Tablet: pin with reduced distance
        '(min-width: 768px) and (max-width: 1023px)': () => {
          const steps = gsap.utils.toArray<HTMLElement>('.process-step');

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              pin: true,
              scrub: 0.5,
              start: 'top top',
              end: `+=${steps.length * 80}%`,
            },
          });

          steps.forEach((step, i) => {
            tl.fromTo(
              step,
              { opacity: 0, y: 40 },
              { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
            );
            if (i < steps.length - 1) {
              tl.to(step, { opacity: 0, y: -30, duration: 0.5 }, '+=0.3');
            }
          });
        },

        // Mobile: simple vertical scroll reveal, no pin
        '(max-width: 767px)': () => {
          const steps = gsap.utils.toArray<HTMLElement>('.process-step-mobile');

          steps.forEach((step) => {
            gsap.from(step, {
              y: 30,
              opacity: 0,
              duration: 0.6,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: step,
                start: 'top 85%',
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
      id="process"
      className="process-section bg-bg-secondary"
      aria-label="Nuestro proceso"
    >
      {/* Desktop / Tablet: pinned stepper */}
      <div className="hidden h-screen items-center justify-center md:flex">
        <div className="relative mx-auto w-full max-w-3xl px-6">
          {/* Section label */}
          <p className="absolute -top-20 left-6 font-mono text-xs uppercase tracking-widest text-yolk lg:left-0">
            Proceso
          </p>

          {PROCESS_STEPS.map((step, index) => {
            const Icon = STEP_ICONS[index];
            return (
              <div
                key={step.number}
                className="process-step absolute inset-x-0 flex items-center gap-12 px-6 opacity-0 lg:px-0"
                style={index === 0 ? {} : { opacity: 0 }}
              >
                {/* Step icon */}
                <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-2xl bg-bg-elevated">
                  <Icon className="h-10 w-10 text-yolk" strokeWidth={1.5} />
                </div>

                {/* Step content */}
                <div>
                  <span className="step-counter font-mono text-5xl font-bold text-text-primary/10">
                    {step.number}
                  </span>
                  <h3 className="mt-2 font-heading text-3xl text-text-primary lg:text-4xl">
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-md font-body text-body text-text-secondary">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile: vertical list */}
      <div className="flex flex-col gap-12 px-6 py-section md:hidden">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-yolk">
            Proceso
          </p>
          <h2 className="mt-3 font-heading text-section text-text-primary">
            Del campo a tu puerta
          </h2>
        </div>

        {PROCESS_STEPS.map((step, index) => {
          const Icon = STEP_ICONS[index];
          return (
            <div
              key={step.number}
              className="process-step-mobile flex items-start gap-6"
            >
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-bg-elevated">
                <Icon className="h-7 w-7 text-yolk" strokeWidth={1.5} />
              </div>
              <div>
                <span className="font-mono text-xs text-text-muted">
                  {step.number}
                </span>
                <h3 className="mt-1 font-heading text-xl text-text-primary">
                  {step.title}
                </h3>
                <p className="mt-2 font-body text-sm text-text-secondary">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
