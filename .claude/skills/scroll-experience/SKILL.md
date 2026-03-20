---
name: scroll-experience
description: "Expert in building immersive scroll-driven experiences - parallax storytelling, scroll animations, interactive narratives, and cinematic web experiences. Like NY Times interactives, Apple product pages, and award-winning web experiences. Makes websites feel like experiences, not just pages. Use when: scroll animation, parallax, scroll storytelling, interactive story, cinematic website."
source: vibeship-spawner-skills (Apache 2.0)
---

# Scroll Experience

**Role**: Scroll Experience Architect

You see scrolling as a narrative device, not just navigation. You create
moments of delight as users scroll. You know when to use subtle animations
and when to go cinematic. You balance performance with visual impact. You
make websites feel like movies you control with your thumb.

## Capabilities

- Scroll-driven animations
- Parallax storytelling
- Interactive narratives
- Cinematic web experiences
- Scroll-triggered reveals
- Progress indicators
- Sticky sections
- Scroll snapping

## Patterns

### Scroll Animation Stack

Tools and techniques for scroll animations

**When to use**: When planning scroll-driven experiences

```python
## Scroll Animation Stack

### Library Options
| Library | Best For | Learning Curve |
|---------|----------|----------------|
| GSAP ScrollTrigger | Complex animations | Medium |
| Framer Motion | React projects | Low |
| Locomotive Scroll | Smooth scroll + parallax | Medium |
| Lenis | Smooth scroll only | Low |
| CSS scroll-timeline | Simple, native | Low |

### GSAP ScrollTrigger Setup
```javascript
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Basic scroll animation
gsap.to('.element', {
  scrollTrigger: {
    trigger: '.element',
    start: 'top center',
    end: 'bottom center',
    scrub: true, // Links animation to scroll position
  },
  y: -100,
  opacity: 1,
});
```

### Framer Motion Scroll
```jsx
import { motion, useScroll, useTransform } from 'framer-motion';

function ParallaxSection() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -200]);

  return (
    <motion.div style={{ y }}>
      Content moves with scroll
    </motion.div>
  );
}
```

### CSS Native (2024+)
```css
@keyframes reveal {
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-on-scroll {
  animation: reveal linear;
  animation-timeline: view();
  animation-range: entry 0% cover 40%;
}
```
```

### Parallax Storytelling

Tell stories through scroll depth

**When to use**: When creating narrative experiences

```javascript
## Parallax Storytelling

### Layer Speeds
| Layer | Speed | Effect |
|-------|-------|--------|
| Background | 0.2x | Far away, slow |
| Midground | 0.5x | Middle depth |
| Foreground | 1.0x | Normal scroll |
| Content | 1.0x | Readable |
| Floating elements | 1.2x | Pop forward |

### Creating Depth
```javascript
// GSAP parallax layers
gsap.to('.background', {
  scrollTrigger: {
    scrub: true
  },
  y: '-20%', // Moves slower
});

gsap.to('.foreground', {
  scrollTrigger: {
    scrub: true
  },
  y: '-50%', // Moves faster
});
```

### Story Beats
```
Section 1: Hook (full viewport, striking visual)
    ↓ scroll
Section 2: Context (text + supporting visuals)
    ↓ scroll
Section 3: Journey (parallax storytelling)
    ↓ scroll
Section 4: Climax (dramatic reveal)
    ↓ scroll
Section 5: Resolution (CTA or conclusion)
```

### Text Reveals
- Fade in on scroll
- Typewriter effect on trigger
- Word-by-word highlight
- Sticky text with changing visuals
```

### Sticky Sections

Pin elements while scrolling through content

**When to use**: When content should stay visible during scroll

```javascript
## Sticky Sections

### CSS Sticky
```css
.sticky-container {
  height: 300vh; /* Space for scrolling */
}

.sticky-element {
  position: sticky;
  top: 0;
  height: 100vh;
}
```

### GSAP Pin
```javascript
gsap.to('.content', {
  scrollTrigger: {
    trigger: '.section',
    pin: true, // Pins the section
    start: 'top top',
    end: '+=1000', // Pin for 1000px of scroll
    scrub: true,
  },
  // Animate while pinned
  x: '-100vw',
});
```

### Horizontal Scroll Section
```javascript
const sections = gsap.utils.toArray('.panel');

gsap.to(sections, {
  xPercent: -100 * (sections.length - 1),
  ease: 'none',
  scrollTrigger: {
    trigger: '.horizontal-container',
    pin: true,
    scrub: 1,
    end: () => '+=' + document.querySelector('.horizontal-container').offsetWidth,
  },
});
```

### Use Cases
- Product feature walkthrough
- Before/after comparisons
- Step-by-step processes
- Image galleries
```

## Anti-Patterns

### ❌ Scroll Hijacking

**Why bad**: Users hate losing scroll control.
Accessibility nightmare.
Breaks back button expectations.
Frustrating on mobile.

**Instead**: Enhance scroll, don't replace it.
Keep natural scroll speed.
Use scrub animations.
Allow users to scroll normally.

### ❌ Animation Overload

**Why bad**: Distracting, not delightful.
Performance tanks.
Content becomes secondary.
User fatigue.

**Instead**: Less is more.
Animate key moments.
Static content is okay.
Guide attention, don't overwhelm.

### ❌ Desktop-Only Experience

**Why bad**: Mobile is majority of traffic.
Touch scroll is different.
Performance issues on phones.
Unusable experience.

**Instead**: Mobile-first scroll design.
Simpler effects on mobile.
Test on real devices.
Graceful degradation.

## ⚠️ Sharp Edges

| Issue | Severity | Solution |
|-------|----------|----------|
| Animations stutter during scroll | high | ## Fixing Scroll Jank |
| Parallax breaks on mobile devices | high | ## Mobile-Safe Parallax |
| Scroll experience is inaccessible | medium | ## Accessible Scroll Experiences |
| Critical content hidden below animations | medium | ## Content-First Scroll Design |

## Related Skills

Works well with: `3d-web-experience`, `frontend`, `ui-design`, `landing-page-design`

---

## Huevos Point — Project Context

**Engine de animación:** GSAP 3 únicamente. NO usar Framer Motion, Locomotive Scroll, Lenis ni CSS scroll-timeline en este proyecto.
**Plugins registrados:** `ScrollTrigger`, `Flip`, `TextPlugin` (en `src/lib/gsap-config.ts`)

### Secuencia de secciones (SRS §4)

```
1. Preloader (2.5-3s) → Logo + counter 0→100 + barra progreso → exit clip-path
2. Hero          → Parallax 5 capas + SplitText + scrub opacity/scale
3. Story         → Pin horizontal (3 slides: Origen / Selección / Tu mesa) + parallax interno
4. Products      → Staggered reveal cards (y:80 rotateX:8 → 0) + micro-interacciones hover
5. Process       → Pin stepper (4 pasos: Recolección/Selección/Empaque/Entrega) + TextPlugin
6. Contact/CTA   → Fondo dark→cream (gsap CSS var transition) + form fields stagger
7. Footer        → Marquee infinito horizontal
```

### Reglas de 60fps (SRS §6.1.2) — OBLIGATORIAS

1. Solo animar `transform` y `opacity`. NUNCA `width`, `height`, `top`, `left`, `margin`, `padding`.
2. `will-change` solo durante animación activa. Remover al completar.
3. `force3D: true` (default en GSAP 3+) para GPU acceleration.
4. DOM queries cacheadas: `gsap.utils.toArray()` una vez. NUNCA `querySelectorAll` en callbacks de scroll.
5. `ScrollTrigger.refresh()` solo tras cambios de layout. No en cada frame.
6. **Lazy init:** Timelines de secciones below-the-fold se crean al aproximarse (`start: 'top bottom+=200px'`, `once: true`).
7. Cleanup: Todo timeline dentro de `useGSAP()` con `gsap.context()`. Revert automático en unmount.

### Configuración global GSAP

```typescript
// src/lib/gsap-config.ts
gsap.registerPlugin(ScrollTrigger, Flip, TextPlugin);
gsap.defaults({ ease: 'power3.out', duration: 0.8 });
ScrollTrigger.defaults({ toggleActions: 'play none none reverse' });
ScrollTrigger.matchMedia({
  '(prefers-reduced-motion: reduce)': () => gsap.globalTimeline.timeScale(100),
});
```

### Hero — Parallax multi-capa

```
CAPA 1 (z:0)  → Background image/video (speed: 0.3x)
CAPA 2 (z:1)  → Overlay gradient (estático)
CAPA 3 (z:2)  → Grain texture (speed: 0.5x)
CAPA 4 (z:3)  → Título (speed: 0.7x, fade + scaleY:0.8 al scrollear)
CAPA 5 (z:4)  → Subtitle + CTA (speed: 0.9x)
```
Título: SplitText char-by-char, stagger 0.03s, ease `power4.out`.

### Story — Pin horizontal

```javascript
ScrollTrigger.create({ trigger: '.story-section', pin: true, start: 'top top', end: '+=300%', scrub: 1 });
gsap.timeline({ ... }).to('.story-track', { xPercent: -66.6, ease: 'none' });
```
Mobile: scroll vertical simple (sin pin). Swipe entre paneles.

### Products — Cards

```javascript
gsap.from('.product-card', {
  scrollTrigger: { trigger: '.products-grid', start: 'top 75%' },
  y: 80, opacity: 0, rotateX: 8, stagger: { amount: 0.6, from: 'start' },
  duration: 1, ease: 'power3.out',
});
```
Hover: scale 1.03, imagen interna 1.08, Flip para descripción oculta, badge bounce `back.out(1.7)`.
Mobile: sin hover, tap para expandir.

### Process — Stepper pinned

```javascript
const tl = gsap.timeline({ scrollTrigger: { pin: true, scrub: 0.5, end: `+=${steps.length * 100}%` } });
// Cada step: fromTo (opacity:0,y:60 → opacity:1,y:0) → hold → to (opacity:0,y:-40)
// TextPlugin para counter "01" → "02" → "03" → "04"
```

### Navbar behavior

```javascript
ScrollTrigger.create({ start: 'top -80', end: 99999,
  onUpdate: (self) => gsap.to('.navbar', { y: self.direction === -1 ? 0 : -100, duration: 0.3 })
});
```

### MagneticButton (CTAs)

```javascript
// mousemove: gsap.to(button, { x: dx*0.3, y: dy*0.3, duration: 0.4, ease: 'power3.out' })
// mouseleave: gsap.to(button, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' })
```

### Marquee infinito

```javascript
gsap.to(track, { x: -totalWidth, duration: totalWidth/speed, ease: 'none', repeat: -1,
  modifiers: { x: gsap.utils.unitize(x => parseFloat(x) % totalWidth) }
});
// Contenido: "HUEVOS POINT • PREMIUM EGGS • FARM TO TABLE • CALIDAD SUPERIOR •"
```

### Confirmación de pedido (path drawing)

```javascript
gsap.timeline()
  .to('.check-circle', { scale: 1, opacity: 1, ease: 'back.out(1.7)' })
  .fromTo('.check-path', { strokeDashoffset: 100 }, { strokeDashoffset: 0, ease: 'power2.inOut' })
  .to('.confirmation-text', { opacity: 1, y: 0 }, '-=0.2');
```
