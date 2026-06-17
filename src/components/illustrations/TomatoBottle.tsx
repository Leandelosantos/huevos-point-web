interface TomatoBottleProps {
  className?: string;
}

export function TomatoBottle({ className }: TomatoBottleProps) {
  const stroke = '#292524';
  const sw = 1.8;
  const cream = '#F0EAD6';
  const amber = '#F59E0B';
  const tomato = '#C0392B';
  const tomatoDark = '#922B21';
  const tomatoLeaf = '#27AE60';

  return (
    <svg
      viewBox="0 0 130 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Tapa de rosca */}
      <rect x="44" y="6" width="42" height="22" rx="5"
        fill={cream} stroke={stroke} strokeWidth={sw} />
      <line x1="44" y1="15" x2="86" y2="15"
        stroke={stroke} strokeWidth="1" opacity="0.5" />
      <line x1="44" y1="21" x2="86" y2="21"
        stroke={stroke} strokeWidth="1" opacity="0.5" />

      {/* Cuello */}
      <rect x="46" y="28" width="38" height="26" rx="3"
        fill={tomato} stroke={stroke} strokeWidth={sw} />

      {/* Hombro */}
      <path d="M 28 54 Q 22 62 22 70 L 22 188 Q 22 204 65 204 Q 108 204 108 188 L 108 70 Q 108 62 102 54 Z"
        fill={tomato} stroke={stroke} strokeWidth={sw} />

      {/* Base */}
      <rect x="22" y="196" width="86" height="12" rx="4"
        fill={tomatoDark} stroke={stroke} strokeWidth={sw} />

      {/* Sticker rectangular — fondo crema */}
      <rect x="30" y="90" width="70" height="90" rx="4"
        fill={cream} stroke={stroke} strokeWidth={sw} />
      <rect x="34" y="94" width="62" height="82" rx="3"
        fill="none" stroke={stroke} strokeWidth="0.7" opacity="0.4" />

      {/* Banda amber en sticker */}
      <rect x="30" y="100" width="70" height="12"
        fill={amber} opacity="0.9" />

      {/* Tomate ilustrado — circulo rojo */}
      <circle cx="65" cy="135" r="18"
        fill={tomato} stroke={stroke} strokeWidth="1.5" />
      {/* Brillo del tomate */}
      <circle cx="60" cy="129" r="4"
        fill="#FAFAF9" opacity="0.35" />
      {/* Hojas del tomate */}
      <path d="M 59 117 Q 60 112 65 113 Q 70 112 71 117"
        stroke={tomatoLeaf} strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M 65 113 L 65 118"
        stroke={tomatoLeaf} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M 57 115 Q 59 113 62 114"
        stroke={tomatoLeaf} strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <path d="M 73 115 Q 71 113 68 114"
        stroke={tomatoLeaf} strokeWidth="1.4" strokeLinecap="round" fill="none" />
      {/* Costillas del tomate */}
      <path d="M 65 117 Q 69 127 65 137" stroke={tomatoDark} strokeWidth="0.9" fill="none" opacity="0.5" />
      <path d="M 65 117 Q 61 127 65 137" stroke={tomatoDark} strokeWidth="0.9" fill="none" opacity="0.5" />

      {/* Líneas de texto simuladas */}
      <rect x="38" y="158" width="54" height="2.5" rx="1.2"
        fill={stroke} opacity="0.7" />
      <rect x="44" y="165" width="42" height="2" rx="1"
        fill={stroke} opacity="0.4" />
      <rect x="48" y="172" width="34" height="1.5" rx="0.8"
        fill={stroke} opacity="0.3" />

      {/* Línea amber decorativa */}
      <line x1="34" y1="148" x2="96" y2="148"
        stroke={amber} strokeWidth="1.8" />

      {/* Reflejo lateral */}
      <path d="M 28 72 Q 27 120 28 188"
        stroke="#FAFAF9" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.25" />
    </svg>
  );
}
