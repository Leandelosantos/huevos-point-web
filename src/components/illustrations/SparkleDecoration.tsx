interface SparkleDecorationProps {
  className?: string;
  /** 'star4' = estrella 4 puntas, 'cross' = cruz, 'dot' = punto */
  variant?: 'star4' | 'cross' | 'dot';
  color?: string;
}

/**
 * Elementos decorativos pequeños para scatter entre secciones.
 * Inspirado en el uso de estrellas/detalles decorativos de planetono.space.
 */
export function SparkleDecoration({ className, variant = 'star4', color = '#F59E0B' }: SparkleDecorationProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {variant === 'star4' && (
        <path
          d="M 20 2 L 22.5 17.5 L 38 20 L 22.5 22.5 L 20 38 L 17.5 22.5 L 2 20 L 17.5 17.5 Z"
          fill={color}
        />
      )}
      {variant === 'cross' && (
        <>
          <rect x="17" y="2" width="6" height="36" rx="3" fill={color}/>
          <rect x="2" y="17" width="36" height="6" rx="3" fill={color}/>
        </>
      )}
      {variant === 'dot' && (
        <circle cx="20" cy="20" r="6" fill={color}/>
      )}
    </svg>
  );
}
