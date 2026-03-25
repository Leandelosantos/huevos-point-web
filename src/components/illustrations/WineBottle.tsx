interface WineBottleProps {
  className?: string;
}

export function WineBottle({ className }: WineBottleProps) {
  const stroke = '#292524';
  const sw = 1.8;
  const cream = '#F0EAD6';
  const amber = '#F59E0B';
  const wine = '#5C1A2E';
  const wineDark = '#3D0E1E';

  return (
    <svg
      viewBox="0 0 110 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Cápsula superior */}
      <rect x="40" y="6" width="30" height="20" rx="5"
        fill={wineDark} stroke={stroke} strokeWidth={sw} />
      <line x1="40" y1="20" x2="70" y2="20"
        stroke={stroke} strokeWidth="1.2" opacity="0.5" />

      {/* Cuello largo (estilo Bordeaux) */}
      <rect x="40" y="26" width="30" height="78" rx="2"
        fill={wine} stroke={stroke} strokeWidth={sw} />

      {/* Anular del cuello */}
      <rect x="36" y="100" width="38" height="8" rx="2"
        fill={wine} stroke={stroke} strokeWidth={sw} />

      {/* Hombros + cuerpo */}
      <path d="M 36 108 Q 18 118 18 130 L 18 262 Q 18 278 55 278 Q 92 278 92 262 L 92 130 Q 92 118 74 108 Z"
        fill={wine} stroke={stroke} strokeWidth={sw} />

      {/* Etiqueta principal — fondo crema */}
      <rect x="26" y="142" width="58" height="82" rx="3"
        fill={cream} stroke={stroke} strokeWidth="1.4" />
      <rect x="30" y="146" width="50" height="74" rx="2"
        fill="none" stroke={stroke} strokeWidth="0.7" opacity="0.4" />

      {/* Franja amber en etiqueta */}
      <rect x="26" y="154" width="58" height="10"
        fill={amber} opacity="0.9" />

      {/* Texto simulado */}
      <rect x="36" y="172" width="38" height="2.5" rx="1.2" fill={stroke} opacity="0.7" />
      <rect x="40" y="178" width="30" height="2" rx="1" fill={stroke} opacity="0.55" />
      <rect x="34" y="188" width="42" height="2" rx="1" fill={stroke} opacity="0.4" />
      <rect x="38" y="194" width="34" height="2" rx="1" fill={stroke} opacity="0.4" />
      {/* Año vintage */}
      <rect x="38" y="206" width="34" height="3" rx="1.5" fill={stroke} opacity="0.65" />

      {/* Contra-etiqueta inferior — fondo crema */}
      <rect x="28" y="232" width="54" height="28" rx="2"
        fill={cream} stroke={stroke} strokeWidth="1" />
      <rect x="32" y="237" width="46" height="1.5" rx="0.8" fill={stroke} opacity="0.35" />
      <rect x="32" y="242" width="46" height="1.5" rx="0.8" fill={stroke} opacity="0.3" />
      <rect x="32" y="247" width="46" height="1.5" rx="0.8" fill={stroke} opacity="0.3" />
      <rect x="32" y="252" width="46" height="1.5" rx="0.8" fill={stroke} opacity="0.25" />

      {/* Reflejo cuello */}
      <path d="M 44 32 L 44 96"
        stroke="#FAFAF9" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.3" />
      {/* Reflejo cuerpo */}
      <path d="M 25 138 Q 24 190 25 260"
        stroke="#FAFAF9" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.25" />
    </svg>
  );
}
