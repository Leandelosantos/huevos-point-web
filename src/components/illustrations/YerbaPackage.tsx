interface YerbaPackageProps {
  className?: string;
}

export function YerbaPackage({ className }: YerbaPackageProps) {
  const stroke = '#292524';
  const sw = 1.8;
  const cream = '#F0EAD6';
  const amber = '#F59E0B';
  const green = '#2D6B1F';
  const greenLight = '#3D8B2A';

  return (
    <svg
      viewBox="0 0 150 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Cuerpo principal del brick — verde mate */}
      <rect x="16" y="22" width="118" height="158" rx="5"
        fill={green} stroke={stroke} strokeWidth={sw} />

      {/* Solapa superior */}
      <path d="M 16 22 L 16 10 Q 75 5 134 10 L 134 22 Z"
        fill={greenLight} stroke={stroke} strokeWidth={sw} />
      <line x1="75" y1="5" x2="75" y2="22"
        stroke={stroke} strokeWidth="1.2" opacity="0.5" />
      <path d="M 16 10 L 30 22"
        stroke={stroke} strokeWidth="1" opacity="0.4" />
      <path d="M 134 10 L 120 22"
        stroke={stroke} strokeWidth="1" opacity="0.4" />

      {/* Solapa inferior */}
      <path d="M 16 180 L 16 192 Q 75 197 134 192 L 134 180 Z"
        fill={greenLight} stroke={stroke} strokeWidth={sw} />
      <line x1="75" y1="180" x2="75" y2="197"
        stroke={stroke} strokeWidth="1.2" opacity="0.5" />
      <path d="M 16 192 L 30 180"
        stroke={stroke} strokeWidth="1" opacity="0.4" />
      <path d="M 134 192 L 120 180"
        stroke={stroke} strokeWidth="1" opacity="0.4" />

      {/* Franja amber superior */}
      <rect x="16" y="22" width="118" height="30"
        fill={amber} />
      <line x1="16" y1="52" x2="134" y2="52"
        stroke={stroke} strokeWidth={sw} />

      {/* Marco interno del área de diseño */}
      <rect x="26" y="60" width="98" height="104" rx="2"
        fill="none" stroke={cream} strokeWidth="1.2" opacity="0.5" />

      {/* Hoja de yerba mate ilustrada — crema sobre verde */}
      <path d="M 75 70 C 58 72 50 86 52 98 C 54 112 66 118 75 118 C 84 118 96 112 98 98 C 100 86 92 72 75 70 Z"
        fill={greenLight} stroke={cream} strokeWidth="1.6" opacity="0.9" />
      {/* Nervadura central */}
      <line x1="75" y1="70" x2="75" y2="118"
        stroke={cream} strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
      {/* Nervaduras laterales */}
      <path d="M 75 80 Q 65 82 58 80"
        stroke={cream} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.7" />
      <path d="M 75 80 Q 85 82 92 80"
        stroke={cream} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.7" />
      <path d="M 75 90 Q 62 93 55 90"
        stroke={cream} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.7" />
      <path d="M 75 90 Q 88 93 95 90"
        stroke={cream} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.7" />
      <path d="M 75 100 Q 64 103 58 101"
        stroke={cream} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.7" />
      <path d="M 75 100 Q 86 103 92 101"
        stroke={cream} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.7" />
      {/* Tallo */}
      <path d="M 75 118 Q 76 124 74 130"
        stroke={cream} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.8" />

      {/* "YERBA MATE" — texto simulado crema */}
      <rect x="36" y="134" width="78" height="3.5" rx="1.8"
        fill={cream} opacity="0.85" />
      <rect x="44" y="142" width="62" height="2.5" rx="1.2"
        fill={cream} opacity="0.65" />
      {/* "Argentina" */}
      <rect x="50" y="150" width="50" height="2" rx="1"
        fill={cream} opacity="0.45" />

      {/* Línea amber de separación */}
      <line x1="36" y1="158" x2="114" y2="158"
        stroke={amber} strokeWidth="2" />

      {/* Código de barras simulado — crema */}
      <rect x="42" y="162" width="66" height="10" rx="1"
        fill="none" stroke={cream} strokeWidth="0.7" opacity="0.35" />
      {[46, 49, 53, 56, 59, 63, 66, 70, 73, 77, 80, 84, 87, 91, 94, 98, 101].map((x, i) => (
        <line key={x} x1={x} y1="162" x2={x} y2="172"
          stroke={cream}
          strokeWidth={i % 3 === 0 ? "2" : i % 3 === 1 ? "1.5" : "1"}
          opacity="0.35" />
      ))}

      {/* Reflejo lateral */}
      <path d="M 24 36 Q 22 100 24 174"
        stroke="#FAFAF9" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.22" />
    </svg>
  );
}
