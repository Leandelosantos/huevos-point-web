interface OliveOilBottleProps {
  className?: string;
}

export function OliveOilBottle({ className }: OliveOilBottleProps) {
  const stroke = '#292524';
  const sw = 1.8;
  const cream = '#F0EAD6';
  const amber = '#F59E0B';
  const olive = '#4A7A28';
  const oliveDark = '#2E5016';

  return (
    <svg
      viewBox="0 0 120 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Cápsula / tapa */}
      <rect x="47" y="8" width="26" height="14" rx="4"
        fill={amber} stroke={stroke} strokeWidth={sw} />

      {/* Cuello */}
      <path d="M 47 22 L 42 54 L 78 54 L 73 22 Z"
        fill={olive} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />

      {/* Cuerpo — hombros + cuerpo principal */}
      <path d="M 42 54 Q 26 70 26 84 L 26 232 Q 26 250 60 250 Q 94 250 94 232 L 94 84 Q 94 70 78 54 Z"
        fill={olive} stroke={stroke} strokeWidth={sw} />

      {/* Etiqueta — fondo crema */}
      <rect x="34" y="110" width="52" height="96" rx="3"
        fill={cream} stroke={stroke} strokeWidth="1.4" />
      <line x1="34" y1="128" x2="86" y2="128"
        stroke={stroke} strokeWidth="1" />
      <line x1="34" y1="194" x2="86" y2="194"
        stroke={stroke} strokeWidth="1" />

      {/* Franja amber en etiqueta */}
      <rect x="34" y="110" width="52" height="18"
        fill={amber} opacity="0.9" />

      {/* Texto "ACEITE" simulado */}
      <rect x="42" y="140" width="36" height="2.5" rx="1.2" fill={stroke} opacity="0.7" />
      <rect x="38" y="147" width="44" height="2" rx="1" fill={stroke} opacity="0.5" />
      <rect x="44" y="153" width="32" height="2" rx="1" fill={stroke} opacity="0.5" />
      {/* "DE OLIVA" */}
      <rect x="40" y="163" width="40" height="2" rx="1" fill={stroke} opacity="0.4" />
      <rect x="44" y="169" width="32" height="2" rx="1" fill={stroke} opacity="0.4" />

      {/* Ramita de olivo */}
      <path d="M 62 178 Q 72 165 74 148"
        stroke={oliveDark} strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <ellipse cx="68" cy="172" rx="5" ry="2.5"
        fill={olive} stroke={oliveDark} strokeWidth="1.2"
        transform="rotate(-40 68 172)" />
      <ellipse cx="72" cy="162" rx="5" ry="2.5"
        fill={olive} stroke={oliveDark} strokeWidth="1.2"
        transform="rotate(30 72 162)" />
      <ellipse cx="74" cy="152" rx="4" ry="2"
        fill={olive} stroke={oliveDark} strokeWidth="1.2"
        transform="rotate(-20 74 152)" />
      {/* Aceituna */}
      <ellipse cx="74" cy="147" rx="3.5" ry="4"
        fill={oliveDark} stroke={stroke} strokeWidth="1.2" />

      {/* Reflejo */}
      <path d="M 33 92 Q 32 140 33 225"
        stroke="#FAFAF9" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.28" />
    </svg>
  );
}
