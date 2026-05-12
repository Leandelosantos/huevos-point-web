import { Phone } from 'lucide-react';
import { PerspectiveMarquee } from '@/components/PerspectiveMarquee';
import { WHATSAPP_NUMBER } from '@/constants/business';

export function Footer() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}`;

  return (
    <footer className="bg-bg-primary" role="contentinfo">
      <PerspectiveMarquee
        items={['Huevos Point', 'De la granja a tu mesa', 'Huevos Premium', 'Calidad Superior']}
        background="#020c1e"
        fadeColor="#020c1e"
        color="#fff2d9"
        fontSize={48}
        fontWeight={700}
        pixelsPerFrame={1.5}
        rotateY={-22}
        rotateX={6}
        perspective={1200}
        height={100}
      />

      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div>
            <p className="font-display text-xl font-bold text-text-primary">
              Huevos Point
            </p>
            <p className="mt-1 font-body text-sm text-text-muted">
              De la granja a tu mesa
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
