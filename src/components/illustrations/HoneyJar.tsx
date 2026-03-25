interface HoneyJarProps {
  className?: string;
}

export function HoneyJar({ className }: HoneyJarProps) {
  const stroke = '#292524';
  const sw = 1.8;
  const cream = '#F0EAD6';
  const amber = '#F59E0B';
  const honey = '#E8A020';
  const honeyDeep = '#B8760E';

  return (
    <svg
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Tapa metálica */}
      <rect x="50" y="8" width="60" height="20" rx="6"
        fill={cream} stroke={stroke} strokeWidth={sw} />
      <line x1="50" y1="17" x2="110" y2="17"
        stroke={stroke} strokeWidth="1" />
      {/* Grip de la tapa */}
      {[62, 70, 78, 86, 94, 102].map((x) => (
        <line key={x} x1={x} y1="8" x2={x} y2="28"
          stroke={stroke} strokeWidth="0.8" opacity="0.45" />
      ))}

      {/* Cuello corto */}
      <path d="M 55 28 L 50 40 L 110 40 L 105 28 Z"
        fill={honey} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />

      {/* Cuerpo del frasco — color miel */}
      <rect x="22" y="40" width="116" height="106" rx="22"
        fill={honey} stroke={stroke} strokeWidth={sw} />

      {/* Sticker hexagonal */}
      <polygon points="80,56 114,74 114,110 80,128 46,110 46,74"
        fill={cream} stroke={stroke} strokeWidth={sw} />
      <polygon points="80,62 108,78 108,106 80,122 52,106 52,78"
        fill="none" stroke={stroke} strokeWidth="0.8" opacity="0.5" />

      {/* Banda amber central */}
      <rect x="46" y="82" width="68" height="12" rx="2"
        fill={amber} />
      {/* "MIEL" en la banda */}
      <rect x="60" y="86" width="40" height="3" rx="1.5"
        fill={stroke} opacity="0.85" />

      {/* Líneas decorativas sticker */}
      <rect x="56" y="77" width="48" height="1.5" rx="0.8"
        fill={stroke} opacity="0.4" />
      <rect x="56" y="99" width="48" height="1.5" rx="0.8"
        fill={stroke} opacity="0.4" />

      {/* Abeja ilustrada */}
      {/* Cuerpo */}
      <ellipse cx="80" cy="70" rx="9" ry="6"
        fill={amber} stroke={stroke} strokeWidth="1.3" />
      {/* Rayas del cuerpo */}
      <line x1="76" y1="65" x2="76" y2="75"
        stroke={stroke} strokeWidth="1.2" />
      <line x1="80" y1="64" x2="80" y2="76"
        stroke={stroke} strokeWidth="1.2" />
      <line x1="84" y1="65" x2="84" y2="75"
        stroke={stroke} strokeWidth="1.2" />
      {/* Alas */}
      <ellipse cx="71" cy="65" rx="7" ry="3.5"
        fill="#FAFAF9" stroke={stroke} strokeWidth="1.2" opacity="0.8"
        transform="rotate(-25 71 65)" />
      <ellipse cx="89" cy="65" rx="7" ry="3.5"
        fill="#FAFAF9" stroke={stroke} strokeWidth="1.2" opacity="0.8"
        transform="rotate(25 89 65)" />
      {/* Cabeza */}
      <circle cx="80" cy="63" r="3" fill={stroke} />
      {/* Antenas */}
      <path d="M 78 61 Q 74 57 72 54"
        stroke={stroke} strokeWidth="1" strokeLinecap="round" fill="none" />
      <path d="M 82 61 Q 86 57 88 54"
        stroke={stroke} strokeWidth="1" strokeLinecap="round" fill="none" />
      <circle cx="72" cy="54" r="1.5" fill={stroke} />
      <circle cx="88" cy="54" r="1.5" fill={stroke} />

      {/* Texto "Artesanal" */}
      <rect x="58" y="112" width="44" height="1.8" rx="0.9"
        fill={stroke} opacity="0.38" />

      {/* Reflejo lateral */}
      <path d="M 30 58 Q 28 95 30 135"
        stroke="#FAFAF9" strokeWidth="4.5" strokeLinecap="round" fill="none" opacity="0.35" />

      {/* Gota de miel cayendo por el cuello */}
      <path d="M 88 40 Q 90 46 88 52"
        stroke={honeyDeep} strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6" />
    </svg>
  );
}
