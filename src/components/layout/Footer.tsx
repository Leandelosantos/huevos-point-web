import { Phone } from 'lucide-react';
import { Marquee } from '@/components/Marquee';
import { MARQUEE_TEXT, WHATSAPP_NUMBER } from '@/constants/business';

export function Footer() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}`;

  return (
    <footer className="bg-bg-primary" role="contentinfo">
      <Marquee text={MARQUEE_TEXT} className="border-t border-shell/10 py-6" />

      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div>
            <p className="font-display text-xl font-bold text-text-primary">
              Huevos Point
            </p>
            <p className="mt-1 font-body text-sm text-text-muted">
              Premium Egg Retail
            </p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-shell/20 px-6 py-3 font-body text-sm text-text-secondary transition-colors hover:border-yolk hover:text-yolk"
            aria-label="Contactar por WhatsApp"
          >
            <Phone className="h-4 w-4" />
            WhatsApp
          </a>
        </div>

        <div className="mt-8 border-t border-shell/10 pt-6 text-center">
          <p className="font-mono text-xs text-text-muted">
            &copy; {new Date().getFullYear()} Huevos Point. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
