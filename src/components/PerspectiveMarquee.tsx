import { useRef, useEffect } from 'react';

interface PerspectiveMarqueeProps {
  items: string[];
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  pixelsPerFrame?: number;
  rotateY?: number;
  rotateX?: number;
  perspective?: number;
  fadeColor?: string;
  background?: string;
  speed?: number;
  className?: string;
  height?: number;
}

const COPIES = 5;

export function PerspectiveMarquee({
  items,
  fontSize = 64,
  color = '#fff2d9',
  fontWeight = 700,
  pixelsPerFrame = 1.5,
  rotateY = -22,
  rotateX = 6,
  perspective = 1200,
  fadeColor = '#020c1e',
  background = '#020c1e',
  speed = 1,
  className,
  height = 120,
}: PerspectiveMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef     = useRef<HTMLDivElement>(null);
  const spansRef     = useRef<(HTMLSpanElement | null)[]>([]);
  const offsetRef    = useRef(0);
  const rafRef       = useRef<number>(0);

  const itemPadding     = fontSize * 0.9;
  const itemWidth       = (item: string) => item.length * fontSize * 0.6 + itemPadding;
  const totalWidth      = items.reduce((acc, item) => acc + itemWidth(item), 0);
  const rendered        = Array.from({ length: COPIES }, () => items).flat();

  useEffect(() => {
    const track     = trackRef.current;
    const container = containerRef.current;
    if (!track || !container) return;

    const loop = () => {
      offsetRef.current -= pixelsPerFrame * speed;
      if (Math.abs(offsetRef.current) >= totalWidth) {
        offsetRef.current += totalWidth;
      }

      track.style.transform = `translateX(${offsetRef.current}px)`;

      const centerX = container.clientWidth / 2;

      // Recalculate each span's blur/opacity from current position
      let x = offsetRef.current;
      spansRef.current.forEach((span, i) => {
        if (!span) return;
        const item      = rendered[i];
        const w         = itemWidth(item);
        const spanCenter = x + w / 2;
        const dist      = Math.abs(spanCenter - centerX);
        const norm      = Math.pow(Math.min(1, dist / (centerX * 0.9)), 2.5);
        const blur      = norm * 2;
        const opacity   = 1 - norm * 0.55;
        span.style.filter  = `blur(${blur}px)`;
        span.style.opacity = String(opacity);
        x += w;
      });

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [pixelsPerFrame, speed, totalWidth]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        height,
        background,
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        perspective: `${perspective}px`,
      }}
    >
      {/* 3D wrapper */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        <div ref={trackRef} style={{ display: 'flex', whiteSpace: 'nowrap' }}>
          {rendered.map((item, i) => (
            <span
              key={i}
              ref={(el) => { spansRef.current[i] = el; }}
              style={{
                display: 'inline-block',
                fontFamily: 'Playfair Display, serif',
                fontSize,
                fontWeight,
                color,
                letterSpacing: '-0.03em',
                paddingRight: itemPadding,
                willChange: 'filter, opacity',
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Fade left/right */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: `linear-gradient(90deg, ${fadeColor} 0%, transparent 15%, transparent 85%, ${fadeColor} 100%)`,
        }}
      />
      {/* Fade top/bottom */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: `linear-gradient(180deg, ${fadeColor} 0%, transparent 28%, transparent 72%, ${fadeColor} 100%)`,
        }}
      />
    </div>
  );
}
