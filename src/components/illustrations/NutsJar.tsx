interface NutsJarProps {
  className?: string;
}

export function NutsJar({ className }: NutsJarProps) {
  const stroke = '#292524';
  const sw = 1.8;
  const cream = '#F0EAD6';
  const amber = '#F59E0B';
  const nutBrown = '#A0703A';
  const nutDark = '#6B4520';

  return (
    <svg
      viewBox="0 0 130 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Tapa de rosca — crema (metal) */}
      <rect x="20" y="8" width="90" height="26" rx="6"
        fill={cream} stroke={stroke} strokeWidth={sw} />
      <line x1="20" y1="17" x2="110" y2="17"
        stroke={stroke} strokeWidth="1" />
      <line x1="20" y1="24" x2="110" y2="24"
        stroke={stroke} strokeWidth="1" />
      {/* Grip de tapa */}
      {[34, 47, 60, 73, 86, 99].map((x) => (
        <line key={x} x1={x} y1="8" x2={x} y2="34"
          stroke={stroke} strokeWidth="0.8" opacity="0.4" />
      ))}

      {/* Hombro + cuerpo — color marrón nuez */}
      <path d="M 24 34 Q 22 44 22 50 L 22 186 Q 22 204 65 204 Q 108 204 108 186 L 108 50 Q 108 44 106 34 Z"
        fill={nutBrown} stroke={stroke} strokeWidth={sw} />

      {/* Base */}
      <rect x="22" y="194" width="86" height="14" rx="4"
        fill={nutBrown} stroke={stroke} strokeWidth={sw} />

      {/* Sticker circular — fondo crema */}
      <circle cx="65" cy="120" r="40"
        fill={cream} stroke={stroke} strokeWidth={sw} />
      <circle cx="65" cy="120" r="34"
        fill="none" stroke={stroke} strokeWidth="0.8" opacity="0.5" />

      {/* Banda amber en sticker */}
      <path d="M 25 120 A 40 40 0 0 1 105 120 L 99 120 A 34 34 0 0 0 31 120 Z"
        fill={amber} opacity="0.9" />

      {/* "FRUTOS" */}
      <rect x="40" y="113" width="50" height="2.5" rx="1.2"
        fill={stroke} opacity="0.8" />
      {/* "SECOS" */}
      <rect x="46" y="120" width="38" height="2.5" rx="1.2"
        fill={stroke} opacity="0.8" />

      {/* Nuez ilustrada — color marrón */}
      <path d="M 65 86 C 54 86 47 94 47 101 C 47 109 55 115 65 115 C 75 115 83 109 83 101 C 83 94 76 86 65 86 Z"
        fill={nutDark} stroke={stroke} strokeWidth="1.5" />
      {/* Ranura central */}
      <line x1="65" y1="86" x2="65" y2="115"
        stroke={cream} strokeWidth="1.2" strokeDasharray="3 2.5" opacity="0.6" />
      {/* Venas superiores */}
      <path d="M 49 98 Q 56 95 65 97 Q 74 95 81 98"
        stroke={cream} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.5" />
      {/* Venas inferiores */}
      <path d="M 49 104 Q 56 107 65 105 Q 74 107 81 104"
        stroke={cream} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.5" />

      {/* Sub-texto del sticker */}
      <rect x="46" y="132" width="38" height="1.5" rx="0.8"
        fill={stroke} opacity="0.38" />

      {/* Línea amber decorativa bajo sticker */}
      <line x1="36" y1="164" x2="94" y2="164"
        stroke={amber} strokeWidth="1.8" />

      {/* Reflejo lateral */}
      <path d="M 28 58 Q 27 110 28 185"
        stroke="#FAFAF9" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.3" />
    </svg>
  );
}
