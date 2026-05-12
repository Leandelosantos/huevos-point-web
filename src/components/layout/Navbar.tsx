import { useRef, useEffect } from 'react';
import { useGSAP } from '@/hooks/useGSAP';
import { gsap, ScrollTrigger } from '@/lib/gsap-config';
import { useAppStore } from '@/stores/useAppStore';
import { NAVBAR_SCROLL_THRESHOLD, NAVBAR_TRANSITION_DURATION } from '@/constants/animation';

const NAV_LINKS = [
  { href: '#story',    label: 'Historia',  shape: '1' },
  { href: '#products', label: 'Productos', shape: '2' },
  { href: '#process',  label: 'Proceso',   shape: '3' },
  { href: '#contact',  label: 'Pedidos',   shape: '4' },
] as const;

export function Navbar() {
  const containerRef  = useRef<HTMLDivElement>(null);
  const headerRef     = useRef<HTMLElement>(null);
  const navWrapRef    = useRef<HTMLDivElement>(null);
  const btnTextsRef   = useRef<HTMLDivElement>(null);

  const isMenuOpen = useAppStore((s) => s.isMenuOpen);
  const setMenuOpen = useAppStore((s) => s.setMenuOpen);

  // ── Scroll show/hide + hover shape setup ──
  useGSAP(
    () => {
      const header = headerRef.current;
      if (!header) return;

      // Show header after scroll threshold, hide on scroll down
      ScrollTrigger.create({
        start: `top -${NAVBAR_SCROLL_THRESHOLD}`,
        end: 99999,
        onUpdate: (self) => {
          if (self.direction === -1) {
            gsap.to(header, { y: 0, duration: NAVBAR_TRANSITION_DURATION, ease: 'power2.out' });
          } else {
            gsap.to(header, { y: '-100%', duration: NAVBAR_TRANSITION_DURATION, ease: 'power2.in' });
          }
        },
        onLeaveBack: () => {
          gsap.to(header, { y: '-100%', duration: NAVBAR_TRANSITION_DURATION, ease: 'power2.in' });
        },
      });

      // Hover shape interactions
      const container = containerRef.current;
      if (!container) return;

      const menuItems     = container.querySelectorAll('.menu-list-item[data-shape]');
      const shapesWrap    = container.querySelector('.ambient-shapes');

      menuItems.forEach((item) => {
        const idx   = item.getAttribute('data-shape');
        const shape = shapesWrap?.querySelector(`.bg-shape-${idx}`);
        if (!shape) return;

        const els = shape.querySelectorAll('.shape-el');

        const onEnter = () => {
          shapesWrap?.querySelectorAll('.bg-shape').forEach((s) => s.classList.remove('active'));
          shape.classList.add('active');
          gsap.fromTo(
            els,
            { scale: 0.5, opacity: 0, rotation: -10 },
            { scale: 1, opacity: 1, rotation: 0, duration: 0.55, stagger: 0.07, ease: 'back.out(1.7)', overwrite: 'auto' }
          );
        };

        const onLeave = () => {
          gsap.to(els, {
            scale: 0.8, opacity: 0, duration: 0.28, ease: 'power2.in',
            onComplete: () => shape.classList.remove('active'),
            overwrite: 'auto',
          });
        };

        item.addEventListener('mouseenter', onEnter);
        item.addEventListener('mouseleave', onLeave);
        (item as any)._cleanup = () => {
          item.removeEventListener('mouseenter', onEnter);
          item.removeEventListener('mouseleave', onLeave);
        };
      });

      return () => {
        menuItems.forEach((item: any) => item._cleanup?.());
      };
    },
    [],
    containerRef
  );

  // ── Menu open/close GSAP animation ──
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const navWrap    = container.querySelector('.nav-overlay-wrapper');
      const menu       = container.querySelector('.menu-content');
      const overlay    = container.querySelector('.nav-overlay');
      const bgPanels   = container.querySelectorAll('.backdrop-layer');
      const navLinks   = container.querySelectorAll('.nav-link');
      const btnTexts   = btnTextsRef.current?.querySelectorAll('p');
      const btnIcon    = container.querySelector('.btn-icon');

      const tl = gsap.timeline();

      if (isMenuOpen) {
        navWrap?.setAttribute('data-nav', 'open');
        tl.set(navWrap, { display: 'block' })
          .set(menu, { xPercent: 0 })
          .fromTo(btnTexts ?? [], { yPercent: 0 }, { yPercent: -100, stagger: 0.15, duration: 0.4 })
          .fromTo(btnIcon, { rotate: 0 }, { rotate: 315, duration: 0.4 }, '<')
          .fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, '<')
          .fromTo(bgPanels, { xPercent: 101 }, { xPercent: 0, stagger: 0.1, duration: 0.55, ease: 'power3.out' }, '<')
          .fromTo(
            navLinks,
            { yPercent: 130, rotate: 8, opacity: 0 },
            { yPercent: 0, rotate: 0, opacity: 1, stagger: 0.06, duration: 0.5, ease: 'power3.out' },
            '<+=0.3'
          );
      } else {
        navWrap?.setAttribute('data-nav', 'closed');
        tl.to(overlay, { autoAlpha: 0, duration: 0.25 })
          .to(menu, { xPercent: 110, duration: 0.42, ease: 'power3.in' }, '<')
          .to(btnTexts ?? [], { yPercent: 0, duration: 0.3 }, '<')
          .to(btnIcon, { rotate: 0, duration: 0.3 }, '<')
          .set(navWrap, { display: 'none' });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [isMenuOpen]);

  // ── Escape key ──
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) setMenuOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isMenuOpen, setMenuOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setMenuOpen(false);
    const href = e.currentTarget.getAttribute('href');
    if (!href) return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      gsap.to(window, { scrollTo: { y: target, offsetY: 80 }, duration: 1, ease: 'power3.inOut' });
    }
  };

  return (
    <div ref={containerRef}>

      {/* ── Fixed header bar ── */}
      <header
        ref={headerRef}
        className="fixed left-0 right-0 top-0 z-50 -translate-y-full rounded-b-[2rem] backdrop-blur-md"
        style={{ backgroundColor: 'transparent' }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">

          {/* Logo imagen */}
          <a href="#hero" onClick={handleNavClick} aria-label="Huevos Point — inicio">
            <img
              src="/images/logo-text.png"
              alt="Huevos Point"
              className="h-9 w-auto"
              draggable={false}
            />
          </a>

          {/* Menu button — "Menú / Cerrar" con GSAP swap */}
          <button
            onClick={() => setMenuOpen(!isMenuOpen)}
            className="flex min-h-[44px] cursor-pointer items-center gap-2 px-3"
            aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isMenuOpen}
          >
            {/* Text slot: overflow-hidden clips the two <p> elements */}
            <div
              ref={btnTextsRef}
              className="overflow-hidden"
              style={{ height: '1.25rem', lineHeight: '1.25rem' }}
            >
              <p className="font-body text-sm font-medium" style={{ color: '#fd904a' }}>Menú</p>
              <p className="font-body text-sm font-medium" style={{ color: '#fd904a' }}>Cerrar</p>
            </div>

            {/* Plus/cross icon — GSAP rotates to ✕ */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              viewBox="0 0 16 16"
              fill="none"
              className="btn-icon flex-shrink-0"
              style={{ color: '#fd904a' }}
            >
              <path d="M7.33333 16L7.33333 0L8.66667 0L8.66667 16L7.33333 16Z" fill="currentColor" />
              <path d="M16 8.66667L0 8.66667L0 7.33333L16 7.33333L16 8.66667Z" fill="currentColor" />
              <path d="M6 7.33333L7.33333 7.33333L7.33333 6C7.33333 6.73637 6.73638 7.33333 6 7.33333Z" fill="currentColor" />
              <path d="M10 7.33333L8.66667 7.33333L8.66667 6C8.66667 6.73638 9.26362 7.33333 10 7.33333Z" fill="currentColor" />
              <path d="M6 8.66667L7.33333 8.66667L7.33333 10C7.33333 9.26362 6.73638 8.66667 6 8.66667Z" fill="currentColor" />
              <path d="M10 8.66667L8.66667 8.66667L8.66667 10C8.66667 9.26362 9.26362 8.66667 10 8.66667Z" fill="currentColor" />
            </svg>
          </button>
        </div>
      </header>

      {/* ── Full-screen kinetic overlay ── */}
      <div data-nav="closed" ref={navWrapRef} className="nav-overlay-wrapper fixed inset-0 z-[60]" style={{ display: 'none' }}>

        {/* Scrim */}
        <div className="nav-overlay absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />

        {/* Menu content */}
        <nav className="menu-content absolute inset-0 overflow-hidden" aria-label="Menú principal">

          {/* Backdrop layers — 3 staggered panels */}
          <div className="menu-bg absolute inset-0">
            <div className="backdrop-layer absolute inset-0 opacity-60" style={{ backgroundColor: '#003a8a' }} />
            <div className="backdrop-layer absolute inset-0 opacity-80" style={{ backgroundColor: '#004aad' }} />
            <div className="backdrop-layer absolute inset-0"            style={{ backgroundColor: '#004aad' }} />

            {/* Ambient shapes — visibles solo cuando un link tiene hover */}
            <div className="ambient-shapes pointer-events-none absolute inset-0">

              {/* Shape 1 — Historia: circles */}
              <svg className="bg-shape bg-shape-1 absolute inset-0 h-full w-full opacity-0" viewBox="0 0 400 400" fill="none">
                <circle className="shape-el" cx="80"  cy="120" r="40" fill="rgba(253,144,74,0.18)" />
                <circle className="shape-el" cx="300" cy="80"  r="60" fill="rgba(255,242,217,0.12)" />
                <circle className="shape-el" cx="200" cy="300" r="80" fill="rgba(253,144,74,0.10)" />
                <circle className="shape-el" cx="350" cy="280" r="30" fill="rgba(255,242,217,0.15)" />
              </svg>

              {/* Shape 2 — Productos: waves */}
              <svg className="bg-shape bg-shape-2 absolute inset-0 h-full w-full opacity-0" viewBox="0 0 400 400" fill="none">
                <path className="shape-el" d="M0 200 Q100 100,200 200 T400 200" stroke="rgba(253,144,74,0.25)" strokeWidth="60" fill="none" />
                <path className="shape-el" d="M0 280 Q100 180,200 280 T400 280" stroke="rgba(255,242,217,0.15)" strokeWidth="40" fill="none" />
              </svg>

              {/* Shape 3 — Proceso: dot grid */}
              <svg className="bg-shape bg-shape-3 absolute inset-0 h-full w-full opacity-0" viewBox="0 0 400 400" fill="none">
                {[50,150,250,350].map((x) => (
                  <circle key={x} className="shape-el" cx={x} cy="50"  r="8"  fill="rgba(253,144,74,0.3)"  />
                ))}
                {[100,200,300].map((x) => (
                  <circle key={x} className="shape-el" cx={x} cy="150" r="12" fill="rgba(255,242,217,0.25)" />
                ))}
                {[50,150,250,350].map((x) => (
                  <circle key={x} className="shape-el" cx={x} cy="250" r="10" fill="rgba(253,144,74,0.25)"  />
                ))}
              </svg>

              {/* Shape 4 — Pedidos: organic blob */}
              <svg className="bg-shape bg-shape-4 absolute inset-0 h-full w-full opacity-0" viewBox="0 0 400 400" fill="none">
                <path className="shape-el" d="M100 100 Q150 50,200 100 Q250 150,200 200 Q150 250,100 200 Q50 150,100 100" fill="rgba(253,144,74,0.14)" />
                <path className="shape-el" d="M250 200 Q300 150,350 200 Q400 250,350 300 Q300 350,250 300 Q200 250,250 200" fill="rgba(255,242,217,0.10)" />
              </svg>
            </div>
          </div>

          {/* ── Botón cerrar — z-[20] garantiza que está sobre backdrop-layers ── */}
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute right-6 top-6 z-[20] flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-full transition-opacity hover:opacity-70"
            aria-label="Cerrar menú"
            style={{ backgroundColor: 'rgba(255,242,217,0.12)' }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fd904a"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Nav links — z-[15] explícito, <a> block full-width para hit area completo */}
          <div className="relative z-[15] flex h-full flex-col justify-center px-12 lg:px-24">
            <ul className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href} className="menu-list-item overflow-hidden" data-shape={link.shape}>
                  <a
                    href={link.href}
                    onClick={handleNavClick}
                    className="nav-link group relative block w-full py-2"
                  >
                    <span
                      className="relative block font-display font-black leading-none"
                      style={{
                        color: '#fd904a',
                        fontSize: 'clamp(2.4rem, 7vw, 5rem)',
                        letterSpacing: '-0.03em',
                      }}
                    >
                      {link.label}
                    </span>
                    <div
                      className="nav-link-hover-bg absolute bottom-2 left-0 h-[3px] w-0 transition-all duration-300 group-hover:w-full"
                      style={{ backgroundColor: '#fd904a' }}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

    </div>
  );
}
