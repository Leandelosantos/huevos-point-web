interface EggIllustrationProps {
  className?: string;
  /** Rotación en grados para variaciones decorativas */
  rotate?: number;
  /** Variante de color: 'cream' (default) | 'amber' | 'outline' */
  variant?: 'cream' | 'amber' | 'outline';
}

/**
 * Huevo estilizado para uso decorativo.
 * Forma real de huevo: más ancho abajo, más estrecho arriba.
 */
export function EggIllustration({ className, rotate = 0, variant = 'cream' }: EggIllustrationProps) {
  const configs = {
    cream:   { fill: '#F0EAD6', stroke: '#292524', sw: 1.8 },
    amber:   { fill: '#F59E0B', stroke: '#292524', sw: 1.8 },
    outline: { fill: 'none',    stroke: '#F0EAD6', sw: 2.5 },
  };
  const { fill, stroke, sw } = configs[variant];

  return (
    <svg
      viewBox="0 0 100 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={rotate !== 0 ? { transform: `rotate(${rotate}deg)` } : undefined}
      aria-hidden="true"
    >
      {/* Forma de huevo — más estrecho arriba, más ancho abajo */}
      <path
        d="M 50 5 C 24 5 8 38 8 66 C 8 100 26 123 50 123 C 74 123 92 100 92 66 C 92 38 76 5 50 5 Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={sw}
      />
      {/* Reflejo sutil */}
      {variant !== 'outline' && (
        <path
          d="M 28 28 C 24 36 22 50 24 62"
          stroke="rgba(250,250,249,0.55)"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
      )}
    </svg>
  );
}
