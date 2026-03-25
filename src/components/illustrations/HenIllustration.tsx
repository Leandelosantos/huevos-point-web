interface HenIllustrationProps {
  className?: string;
}

/**
 * Gallina ilustrada - personaje principal de Huevos Point.
 * Estilo editorial premium: líneas limpias, paleta limitada cream/amber.
 * viewBox 0 0 300 320 — orientada hacia la derecha.
 */
export function HenIllustration({ className }: HenIllustrationProps) {
  const stroke = '#292524';
  const sw = 1.8;
  const body = '#F0EAD6';
  const bodyDark = '#E5D9C4';
  const amber = '#F59E0B';
  const eyeColor = '#1C1917';
  const highlight = '#FAFAF9';

  return (
    <svg
      viewBox="0 0 300 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* ── Plumas de cola (atrás del cuerpo, lado izquierdo) ── */}
      <ellipse
        cx="42" cy="182" rx="28" ry="54"
        fill={bodyDark} stroke={stroke} strokeWidth={sw}
        transform="rotate(-28 42 182)"
      />
      <ellipse
        cx="58" cy="174" rx="25" ry="48"
        fill={body} stroke={stroke} strokeWidth={sw}
        transform="rotate(-14 58 174)"
      />
      <ellipse
        cx="72" cy="168" rx="22" ry="42"
        fill={bodyDark} stroke={stroke} strokeWidth={sw}
        transform="rotate(-3 72 168)"
      />

      {/* ── Cuerpo principal ── */}
      <ellipse
        cx="132" cy="192" rx="90" ry="72"
        fill={body} stroke={stroke} strokeWidth={sw}
      />

      {/* ── Ala (oval más oscuro sobre el cuerpo) ── */}
      <ellipse
        cx="106" cy="196" rx="54" ry="40"
        fill={bodyDark} stroke={stroke} strokeWidth={sw}
        transform="rotate(8 106 196)"
      />
      {/* Líneas de plumas del ala */}
      <path d="M 68 193 Q 90 184 114 186" stroke="#C4B49A" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
      <path d="M 66 206 Q 88 197 112 200" stroke="#C4B49A" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
      <path d="M 69 218 Q 89 210 110 213" stroke="#C4B49A" strokeWidth="1.2" strokeLinecap="round" fill="none"/>

      {/* ── Cuello (une cuerpo con cabeza) ── */}
      <ellipse
        cx="196" cy="158" rx="30" ry="44"
        fill={body} stroke={stroke} strokeWidth={sw}
      />

      {/* ── Cabeza ── */}
      <circle
        cx="210" cy="97" r="52"
        fill={body} stroke={stroke} strokeWidth={sw}
      />

      {/* ── Cresta (3 círculos superpuestos, amber) ── */}
      <circle cx="196" cy="51" r="14" fill={amber} stroke={stroke} strokeWidth={sw}/>
      <circle cx="212" cy="44" r="13" fill={amber} stroke={stroke} strokeWidth={sw}/>
      <circle cx="227" cy="49" r="12" fill={amber} stroke={stroke} strokeWidth={sw}/>
      {/* Base de la cresta (tapa el borde inferior de los círculos) */}
      <rect x="184" y="56" width="58" height="16" fill={body}/>
      <path d="M 184 63 Q 212 72 242 63" stroke={stroke} strokeWidth={sw} fill="none"/>

      {/* ── Barbilla (wattle, amber) ── */}
      <ellipse
        cx="256" cy="132" rx="10" ry="15"
        fill={amber} stroke={stroke} strokeWidth={sw}
      />

      {/* ── Pico (triángulo amber apuntando a la derecha) ── */}
      <path
        d="M 252 87 L 274 96 L 252 106 Z"
        fill={amber} stroke={stroke} strokeWidth={sw} strokeLinejoin="round"
      />

      {/* ── Ojo ── */}
      <circle cx="228" cy="84" r="10" fill={eyeColor}/>
      <circle cx="232" cy="80" r="3.5" fill={highlight}/>

      {/* ── Patas (amber) ── */}
      <line x1="116" y1="260" x2="108" y2="298" stroke={amber} strokeWidth="6" strokeLinecap="round"/>
      <line x1="154" y1="260" x2="162" y2="298" stroke={amber} strokeWidth="6" strokeLinecap="round"/>

      {/* ── Pies izquierdo (3 dedos) ── */}
      <path d="M 84 298 L 108 298" stroke={amber} strokeWidth="4.5" strokeLinecap="round"/>
      <path d="M 104 286 L 108 298" stroke={amber} strokeWidth="4.5" strokeLinecap="round"/>
      <path d="M 108 298 L 108 310" stroke={amber} strokeWidth="4.5" strokeLinecap="round"/>

      {/* ── Pie derecho (3 dedos) ── */}
      <path d="M 162 298 L 186 298" stroke={amber} strokeWidth="4.5" strokeLinecap="round"/>
      <path d="M 162 298 L 165 286" stroke={amber} strokeWidth="4.5" strokeLinecap="round"/>
      <path d="M 162 298 L 162 310" stroke={amber} strokeWidth="4.5" strokeLinecap="round"/>

      {/* ── Huevo en la base (elemento narrativo) ── */}
      <path
        d="M 90 272 C 78 272 72 282 72 290 C 72 300 80 308 90 308 C 100 308 108 300 108 290 C 108 282 102 272 90 272 Z"
        fill={body} stroke={stroke} strokeWidth={sw}
        opacity="0.7"
      />
    </svg>
  );
}
