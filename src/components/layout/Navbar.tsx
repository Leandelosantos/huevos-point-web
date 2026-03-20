import { useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { useGSAP } from '@/hooks/useGSAP';
import { gsap, ScrollTrigger } from '@/lib/gsap-config';
import { useAppStore } from '@/stores/useAppStore';
import { cn } from '@/lib/utils';
import { NAVBAR_SCROLL_THRESHOLD, NAVBAR_TRANSITION_DURATION } from '@/constants/animation';

const NAV_LINKS = [
  { href: '#story', label: 'Historia' },
  { href: '#products', label: 'Productos' },
  { href: '#process', label: 'Proceso' },
  { href: '#contact', label: 'Pedidos' },
] as const;

export function Navbar() {
  const headerRef = useRef<HTMLElement>(null);
  const isMenuOpen = useAppStore((state) => state.isMenuOpen);
  const setMenuOpen = useAppStore((state) => state.setMenuOpen);

  useGSAP(() => {
    const header = headerRef.current;
    if (!header) return;

    // Hidden in hero, appears after scrolling past threshold
    ScrollTrigger.create({
      start: `top -${NAVBAR_SCROLL_THRESHOLD}`,
      end: 99999,
      onUpdate: (self) => {
        if (self.direction === -1) {
          // Scrolling up → show
          gsap.to(header, { y: 0, duration: NAVBAR_TRANSITION_DURATION, ease: 'power2.out' });
        } else {
          // Scrolling down → hide
          gsap.to(header, { y: '-100%', duration: NAVBAR_TRANSITION_DURATION, ease: 'power2.in' });
        }
      },
      onLeaveBack: () => {
        // Back at top → hide
        gsap.to(header, { y: '-100%', duration: NAVBAR_TRANSITION_DURATION, ease: 'power2.in' });
      },
    });
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setMenuOpen(false);
    const href = e.currentTarget.getAttribute('href');
    if (!href) return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      gsap.to(window, {
        scrollTo: { y: target, offsetY: 80 },
        duration: 1,
        ease: 'power3.inOut',
      });
    }
  };

  return (
    <>
      <header
        ref={headerRef}
        className="navbar fixed top-0 left-0 right-0 z-50 -translate-y-full bg-bg-primary/90 backdrop-blur-md border-b border-shell/10"
      >
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4"
          aria-label="Navegaci\u00f3n principal"
        >
          <a
            href="#hero"
            onClick={handleNavClick}
            className="font-display text-xl font-bold text-text-primary"
          >
            Huevos Point
          </a>

          {/* Desktop links */}
          <ul className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={handleNavClick}
                  className="font-body text-sm text-text-secondary transition-colors hover:text-yolk"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!isMenuOpen)}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center lg:hidden"
            aria-label={isMenuOpen ? 'Cerrar men\u00fa' : 'Abrir men\u00fa'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-text-primary" />
            ) : (
              <Menu className="h-6 w-6 text-text-primary" />
            )}
          </button>
        </nav>
      </header>

      {/* Mobile overlay */}
      <div
        className={cn(
          'fixed inset-0 z-40 flex flex-col items-center justify-center bg-bg-primary transition-all duration-300 lg:hidden',
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Men\u00fa de navegaci\u00f3n"
      >
        <nav>
          <ul className="flex flex-col items-center gap-10">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={handleNavClick}
                  className="font-heading text-3xl text-text-primary transition-colors hover:text-yolk"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
