# Software Requirements Specification (SRS)

## HUEVOS POINT — Premium Egg Retail Landing Page

**Versión:** 1.0.0
**Fecha:** 2026-03-18
**Autor:** Senior Full-Stack Developer & Creative Technologist
**Stack:** React + Vite · GSAP · Supabase · Tailwind + Shadcn/UI · Express.js (condicional)

---

## 1. Introducción

### 1.1 Visión del Proyecto

Huevos Point es una landing page de experiencia inmersiva para un local de venta de huevos que opera bajo el concepto **Premium Egg Retail** — un posicionamiento que eleva un producto cotidiano a la categoría de experiencia de lujo. La web no es un catálogo; es un **scroll-driven storytelling** que transforma la percepción del huevo como commodity y lo presenta como un ingrediente curado, trazable y premium.

La dirección estética se inspira en la intersección de tres lenguajes visuales extraídos de los sitios de referencia:

- **Planetoño**: Tipografía expresiva con variación de casing (mayúsculas/minúsculas alternadas), scroll-based product reveal con personajes ilustrados, navegación minimal y uso de GSAP para transiciones de sección completas.
- **SŌM (drinksom.eu)**: Branding ritual-premium, loader con counter animado, hero full-bleed con tipografía oversized, marquee horizontal infinito, scroll-pinning de secciones con revelación progresiva de beneficios, CTA con línea animada.
- **Barcoop Bevy**: Product cards con hover state que revela descripción + CTA, grid de productos con imágenes con sombra, sección de recetas como contenido complementario, marquee ticker horizontal.
- **Phantom.land**: Lista de proyectos como scroll infinito con hover-reveal de imágenes, tipografía monoespaciada + serif para contraste, transiciones suaves entre estados.
- **National Geographic Into the Amazon**: Scroll storytelling full-immersive, parallax de capas múltiples, transición de escenas basada en scroll position, uso de video/imagen como canvas narrativo.

### 1.2 Objetivos de Conversión

| Objetivo | KPI | Meta |
|---|---|---|
| Generación de pedidos | Formularios enviados / visitantes únicos | > 5% conversion rate |
| Engagement con scroll | % usuarios que alcanzan la sección de productos | > 65% |
| Tiempo en sitio | Duración promedio de sesión | > 90 segundos |
| Contacto directo | Clics en WhatsApp / teléfono | > 8% CTR |
| Percepción de marca | Bounce rate | < 35% |

### 1.3 Alcance

La landing page es un **Single Page Application (SPA)** con scroll vertical continuo. No incluye e-commerce transaccional (carrito de compras, pasarela de pago). El flujo de conversión termina en un formulario de contacto/pedido que persiste en Supabase y opcionalmente notifica vía webhook.

---

## 2. Arquitectura del Sistema

### 2.1 Diagrama Conceptual de Flujo de Datos

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENTE (Browser)                        │
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────┐   │
│  │  React + Vite │───▶│  GSAP Engine  │───▶│  ScrollTrigger   │   │
│  │  (SPA Shell)  │    │  (Timeline)   │    │  (Scroll Events) │   │
│  └──────┬───────┘    └──────────────┘    └──────────────────┘   │
│         │                                                       │
│         │  Estado local: Zustand (ligero)                       │
│         │  ├── UI state (sección activa, menu open)             │
│         │  ├── Form state (pedido en curso)                     │
│         │  └── Animation state (scroll progress)                │
│         │                                                       │
│  ┌──────▼───────┐                                               │
│  │ Supabase SDK  │  @supabase/supabase-js                       │
│  │  (Client)     │                                               │
│  └──────┬───────┘                                               │
└─────────┼───────────────────────────────────────────────────────┘
          │ HTTPS (REST + Realtime)
          │
┌─────────▼───────────────────────────────────────────────────────┐
│                     SUPABASE (Backend-as-a-Service)              │
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────┐   │
│  │  Auth (anon)  │    │  PostgreSQL   │    │  Storage (CDN)   │   │
│  │  RLS Policies │    │  (Database)   │    │  (Imágenes)      │   │
│  └──────────────┘    └──────┬───────┘    └──────────────────┘   │
│                             │                                   │
│  Tablas:                    │                                   │
│  ├── products ──────────────┤                                   │
│  ├── orders ────────────────┤                                   │
│  ├── contact_messages ──────┘                                   │
│  └── site_config (contenido editable)                           │
│                                                                 │
│  Edge Functions (opcional):                                     │
│  └── notify-order → Webhook a WhatsApp Business API             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    EXPRESS.js (CONDICIONAL)                      │
│  Solo se implementa si se requiere:                             │
│  ├── Proxy para APIs de terceros (WhatsApp, email transaccional)│
│  ├── Rate limiting avanzado no cubierto por Supabase RLS        │
│  └── SSR parcial para SEO de contenido dinámico                 │
│                                                                 │
│  En caso contrario: Supabase Edge Functions cubren toda la      │
│  lógica server-side necesaria.                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Decisiones Arquitectónicas

| Decisión | Justificación |
|---|---|
| **SPA con React + Vite** | Build rápido, HMR nativo, tree-shaking óptimo para bundle size mínimo. Vite produce chunks granulares que permiten lazy loading por sección. |
| **GSAP como engine de animación único** | Control total sobre timelines, scrub preciso con ScrollTrigger, performance superior a CSS animations para secuencias complejas. Licencia gratuita para uso no-comercial; verificar licencia Business para producción. |
| **Supabase over Firebase** | PostgreSQL nativo (queries complejas si escala), Row Level Security integrado, Storage con CDN, Edge Functions con Deno runtime. |
| **Zustand over Redux/Context** | Footprint mínimo (~1KB), API sin boilerplate, compatible con React 18 concurrent features. Solo se usa para estado de UI y formulario — no para datos de servidor. |
| **Tailwind + Shadcn/UI** | Utility-first para velocidad de desarrollo. Shadcn/UI provee componentes accesibles (Radix primitives) con estilado completo vía Tailwind. No agrega peso al bundle (copy-paste, no dependencia). |
| **Express.js condicional** | Se evita overhead de servidor propio. Solo se implementa si Supabase Edge Functions no cubren un requerimiento específico (ej: proxy CORS para API externa). |

### 2.3 Estructura de Directorios

```
huevos-point/
├── public/
│   ├── fonts/                    # Fuentes self-hosted (WOFF2)
│   ├── images/
│   │   ├── hero/                 # Assets hero section (WebP + AVIF)
│   │   ├── products/             # Fotos de productos optimizadas
│   │   ├── textures/             # Noise, grain overlays
│   │   └── og-image.jpg          # Open Graph
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Loader.tsx        # Preloader animado con counter
│   │   ├── sections/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── StorySection.tsx
│   │   │   ├── ProductsSection.tsx
│   │   │   ├── ProcessSection.tsx
│   │   │   ├── ContactSection.tsx
│   │   │   └── CTASection.tsx
│   │   ├── ui/                   # Shadcn/UI components
│   │   ├── ProductCard.tsx
│   │   ├── AnimatedText.tsx      # Wrapper GSAP SplitText
│   │   ├── Marquee.tsx           # Ticker horizontal infinito
│   │   └── MagneticButton.tsx    # Botón con efecto magnético
│   ├── hooks/
│   │   ├── useGSAP.ts           # Custom hook para cleanup de timelines
│   │   ├── useScrollProgress.ts # Progreso de scroll normalizado
│   │   └── useMediaQuery.ts     # Breakpoints reactivos
│   ├── lib/
│   │   ├── supabase.ts          # Cliente Supabase inicializado
│   │   ├── gsap-config.ts       # Registro de plugins + defaults
│   │   └── utils.ts             # Helpers (cn, formatPrice, etc.)
│   ├── stores/
│   │   └── useAppStore.ts       # Zustand store
│   ├── styles/
│   │   ├── globals.css           # Tailwind directives + custom props
│   │   ├── fonts.css             # @font-face declarations
│   │   └── animations.css        # Keyframes CSS fallback
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces
│   ├── App.tsx
│   └── main.tsx
├── supabase/
│   ├── migrations/               # SQL migrations
│   ├── functions/                # Edge Functions
│   └── seed.sql                  # Datos iniciales de productos
├── .env.local
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 3. Especificaciones de UI/UX

### 3.1 Dirección Estética

**Concepto:** "Farm-to-Table Luxury" — La intersección entre lo orgánico-rústico y el diseño editorial de alta gama. El sitio debe sentirse como una revista de gastronomía premium que cobra vida con el scroll.

**Tono visual:** Dark mode dominante con acentos cálidos. El fondo oscuro eleva el contraste de las fotografías de producto (huevos con iluminación de estudio sobre superficies naturales). Las texturas grain/noise aportan tactilidad digital.

### 3.2 Paleta de Colores

```css
:root {
  /* === BASE === */
  --color-bg-primary:      #0C0A09;     /* Stone 950 — fondo principal */
  --color-bg-secondary:    #1C1917;     /* Stone 900 — secciones alternas */
  --color-bg-elevated:     #292524;     /* Stone 800 — cards, modals */

  /* === BRAND ACCENT === */
  --color-yolk:            #F59E0B;     /* Amber 500 — acento primario (yema) */
  --color-yolk-light:      #FCD34D;     /* Amber 300 — hover states */
  --color-yolk-deep:       #D97706;     /* Amber 600 — pressed states */

  /* === NEUTRAL TEXT === */
  --color-text-primary:    #FAFAF9;     /* Stone 50 — headings */
  --color-text-secondary:  #A8A29E;     /* Stone 400 — body copy */
  --color-text-muted:      #78716C;     /* Stone 500 — captions */

  /* === SEMANTIC === */
  --color-cream:           #FFFBEB;     /* Amber 50 — sección clara de contraste */
  --color-shell:           #D6D3D1;     /* Stone 300 — borders, dividers */
  --color-success:         #22C55E;     /* Green 500 — confirmación de envío */
  --color-error:           #EF4444;     /* Red 500 — errores de validación */

  /* === OVERLAY === */
  --color-grain-opacity:   0.04;        /* Intensidad del noise texture */
  --color-gradient-hero:   linear-gradient(180deg, transparent 0%, #0C0A09 100%);
}
```

**Regla de uso:** La paleta sigue la proporción 70-20-10:
- **70%** fondos oscuros (`bg-primary`, `bg-secondary`)
- **20%** tipografía y elementos neutros (`text-primary`, `shell`)
- **10%** acento yolk como call-to-action y highlight

### 3.3 Tipografía

| Rol | Fuente | Peso | Tamaño (Desktop / Mobile) | Justificación |
|---|---|---|---|---|
| **Display / Hero** | **Playfair Display** | 700, 900 | 80–120px / 40–56px | Serif editorial con contraste alto de trazos. Evoca lujo gastronómico. Las ligaduras opcionales agregan carácter. |
| **Headings** | **Instrument Serif** | 400 | 40–64px / 28–36px | Serif contemporánea, legible en tamaños grandes. Complementa a Playfair sin competir. |
| **Body / UI** | **Satoshi** | 400, 500, 700 | 16–18px / 14–16px | Sans-serif geométrica con personalidad. Excelente legibilidad en pantalla, alternativa distintiva a Inter/Roboto. |
| **Accent / Labels** | **JetBrains Mono** | 400 | 11–13px | Monoespaciada para etiquetas de precio, numeradores de sección ("01", "02"), datos técnicos del producto. Aporta contraste tipográfico industrial. |

**Escalado tipográfico:** Se usa `clamp()` para fluid typography:

```css
.hero-title {
  font-size: clamp(2.5rem, 8vw + 1rem, 7.5rem);
  line-height: 0.95;
  letter-spacing: -0.03em;
}

.section-heading {
  font-size: clamp(1.75rem, 4vw + 0.5rem, 4rem);
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.body-text {
  font-size: clamp(0.875rem, 1vw + 0.5rem, 1.125rem);
  line-height: 1.65;
}
```

### 3.4 Jerarquía Visual y Layout

**Grid system:** CSS Grid de 12 columnas con gutters de 24px (mobile) / 32px (desktop). Las secciones principales rompen el grid intencionalmente con elementos full-bleed y offsets asimétricos.

**Composición espacial por sección:**

1. **Hero:** Full viewport (100vh), imagen/video background con overlay gradient, título centrado oversized, sin navbar visible (aparece al hacer scroll).
2. **Story:** Layout split 50/50 con imagen a la izquierda (con parallax sutil) y texto a la derecha. El texto se revela línea por línea con scroll.
3. **Products:** Grid asimétrico — 1 card grande (60% width) + 2 cards pequeñas apiladas (40% width). Alterna el layout en cada fila.
4. **Process:** Sección pinned (sticky) con 3–4 pasos que se revelan secuencialmente mientras el usuario scrollea. Cada paso ocupa el viewport completo con transición de fade/slide.
5. **Contact/CTA:** Fondo claro (cream) para ruptura visual. Formulario centrado con campos generosos.
6. **Footer:** Minimal, dark, con marquee ticker de texto.

---

## 4. Plan de Animaciones (GSAP Focus)

### 4.1 Configuración Global de GSAP

```typescript
// src/lib/gsap-config.ts
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(ScrollTrigger, Flip, TextPlugin);

// Defaults globales para consistencia
gsap.defaults({
  ease: 'power3.out',
  duration: 0.8,
});

// ScrollTrigger defaults
ScrollTrigger.defaults({
  toggleActions: 'play none none reverse',
});

// Responsive: desactivar animaciones pesadas en low-end devices
ScrollTrigger.matchMedia({
  '(prefers-reduced-motion: reduce)': () => {
    gsap.globalTimeline.timeScale(100); // Instant transitions
  },
});
```

### 4.2 Preloader (Loader.tsx)

**Referencia:** Inspirado en el loader con counter de SŌM (drinksom.eu).

| Propiedad | Valor |
|---|---|
| Duración total | 2.5–3s |
| Trigger | `window.onload` + asset preloading |
| Easing del counter | `power2.inOut` |
| Exit animation | Clip-path `circle()` expand desde el centro o cortina vertical split |

**Secuencia de timeline:**

```
t=0.0s  → Logo Huevos Point aparece (fade + scale desde 0.8)
t=0.3s  → Counter numérico empieza: 0 → 100 (TextPlugin o counter manual)
t=0.3s  → Barra de progreso horizontal se llena (scaleX: 0 → 1)
t=2.5s  → Counter llega a 100
t=2.6s  → Logo sube (y: -100%, opacity: 0)
t=2.7s  → Fondo se divide en dos mitades (clip-path o translateY opuestos)
t=3.0s  → Hero section visible. ScrollTrigger se inicializa.
```

### 4.3 Scroll Experience — Sección por Sección

#### 4.3.1 Hero Section

**Tipo:** Parallax multi-capa + text reveal.

```
CAPA 1 (z-index: 0)  → Background image/video (speed: 0.3x del scroll)
CAPA 2 (z-index: 1)  → Overlay gradient (estático)
CAPA 3 (z-index: 2)  → Partículas/textura grain (speed: 0.5x)
CAPA 4 (z-index: 3)  → Título principal (speed: 0.7x, fade out al scrollear)
CAPA 5 (z-index: 4)  → Subtitle + CTA (speed: 0.9x)
```

**Interacciones:**
- El título se revela con `SplitText` (o implementación manual char-by-char) con stagger de 0.03s por carácter, ease `power4.out`.
- Al scrollear, el título se comprime (scaleY: 0.8) y desvanece (opacity: 0) con `scrub: true`.
- Un indicador de scroll (flecha o línea animada) pulsa infinitamente en la parte inferior.

#### 4.3.2 Story Section — "No es solo un huevo"

**Tipo:** Pin + horizontal reveal.

```javascript
// Concepto: La sección se "pinea" y el contenido se desplaza horizontalmente
ScrollTrigger.create({
  trigger: '.story-section',
  pin: true,
  start: 'top top',
  end: '+=300%',    // 3x el viewport de scroll distance
  scrub: 1,
});

// Timeline del contenido horizontal
const tl = gsap.timeline({ scrollTrigger: { /* config above */ } });
tl.to('.story-track', { xPercent: -66.6, ease: 'none' });
// Parallax interno: las imágenes se mueven a velocidad diferente al texto
tl.to('.story-image', { xPercent: -15, ease: 'none' }, 0);
```

**Paneles internos (3 slides horizontales):**

1. **"Origen"** — Imagen de granja + texto sobre trazabilidad. Texto se revela con `fromTo` (y: 40, opacity: 0 → y: 0, opacity: 1).
2. **"Selección"** — Imagen de huevos clasificados. Números animados (contador de huevos seleccionados por día).
3. **"Tu mesa"** — Imagen lifestyle de plato terminado. CTA hacia productos.

#### 4.3.3 Products Section — Catálogo

**Tipo:** Staggered reveal + scroll-triggered entrance.

**Animación de entrada de cards:**

```javascript
gsap.from('.product-card', {
  scrollTrigger: {
    trigger: '.products-grid',
    start: 'top 75%',
  },
  y: 80,
  opacity: 0,
  rotateX: 8,           // Sutil rotación 3D
  stagger: {
    amount: 0.6,         // Stagger total de 600ms
    from: 'start',
  },
  duration: 1,
  ease: 'power3.out',
});
```

**Micro-interacciones en ProductCard:**

| Evento | Animación | Duración | Easing |
|---|---|---|---|
| `mouseenter` | Scale card a 1.03, shadow spread +8px, imagen interna scale 1.08 | 0.4s | `power2.out` |
| `mouseleave` | Revert todos los valores | 0.35s | `power2.inOut` |
| `mouseenter` | Badge de precio hace un bounce sutil (y: -4 → 0) | 0.3s | `back.out(1.7)` |
| `mouseenter` | Descripción oculta se revela (height: 0 → auto vía Flip) | 0.5s | `power3.out` |
| `click/tap (mobile)` | Card expande con Flip plugin a vista detallada | 0.6s | `power4.inOut` |

#### 4.3.4 Process Section — "Del campo a tu puerta"

**Tipo:** Pinned section con stepper animado.

```javascript
const steps = gsap.utils.toArray('.process-step');
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: '.process-section',
    pin: true,
    scrub: 0.5,
    start: 'top top',
    end: `+=${steps.length * 100}%`,
  },
});

steps.forEach((step, i) => {
  // Cada step: fade in, hold, fade out
  tl.fromTo(step,
    { opacity: 0, y: 60 },
    { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
  );
  if (i < steps.length - 1) {
    tl.to(step, { opacity: 0, y: -40, duration: 0.5 }, '+=0.5');
  }

  // Número del paso se anima con TextPlugin
  tl.to(`.step-counter-${i}`, {
    text: { value: `0${i + 1}` },
    duration: 0.3,
  }, '<');
});
```

**Steps definidos:**

1. **Recolección** — Icono/ilustración de nido + texto.
2. **Selección y clasificación** — Visual de huevos siendo clasificados por tamaño/color.
3. **Empaque** — Packaging premium (ilustración o foto).
4. **Entrega** — Mapa simplificado o ícono de delivery.

#### 4.3.5 Contact/CTA Section

**Tipo:** Reveal con cambio de fondo (dark → cream).

```javascript
// Transición de color de fondo
gsap.to('body', {
  scrollTrigger: {
    trigger: '.contact-section',
    start: 'top 80%',
    end: 'top 20%',
    scrub: true,
  },
  '--bg-current': 'var(--color-cream)',
});

// Campos del formulario entran con stagger
gsap.from('.form-field', {
  scrollTrigger: { trigger: '.contact-form', start: 'top 70%' },
  y: 30,
  opacity: 0,
  stagger: 0.1,
  duration: 0.6,
});
```

#### 4.3.6 Marquee / Ticker Horizontal

**Referencia:** Patrón de SŌM y Barcoop Bevy.

```javascript
// Marquee infinito con velocidad constante
function createMarquee(selector: string, speed: number = 50) {
  const track = document.querySelector(selector);
  const content = track.innerHTML;
  track.innerHTML += content; // Duplicar contenido

  const totalWidth = track.scrollWidth / 2;

  gsap.to(track, {
    x: -totalWidth,
    duration: totalWidth / speed,
    ease: 'none',
    repeat: -1,
    modifiers: {
      x: gsap.utils.unitize(x => parseFloat(x) % totalWidth),
    },
  });
}
```

**Contenido del marquee:** "HUEVOS POINT • PREMIUM EGGS • FARM TO TABLE • CALIDAD SUPERIOR •" repetido.

### 4.4 Navbar Behavior

```javascript
// Navbar: oculta en hero, aparece con scroll
ScrollTrigger.create({
  start: 'top -80',
  end: 99999,
  toggleClass: { className: 'navbar--visible', targets: '.navbar' },
  onUpdate: (self) => {
    // Hide on scroll down, show on scroll up
    if (self.direction === -1) {
      gsap.to('.navbar', { y: 0, duration: 0.3 });
    } else {
      gsap.to('.navbar', { y: -100, duration: 0.3 });
    }
  },
});
```

### 4.5 MagneticButton — Efecto Magnético en CTAs

```javascript
// El botón "sigue" al cursor dentro de un radio definido
function magneticEffect(button: HTMLElement, strength: number = 0.3) {
  button.addEventListener('mousemove', (e) => {
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(button, {
      x: x * strength,
      y: y * strength,
      duration: 0.4,
      ease: 'power3.out',
    });
  });

  button.addEventListener('mouseleave', () => {
    gsap.to(button, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
  });
}
```

---

## 5. Requerimientos Funcionales

### 5.1 Catálogo de Productos

#### 5.1.1 Modelo de Datos (Supabase / PostgreSQL)

```sql
-- Tabla de productos
CREATE TABLE products (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name          TEXT NOT NULL,                    -- "Huevos de Campo Libre"
  slug          TEXT UNIQUE NOT NULL,             -- "huevos-campo-libre"
  description   TEXT,                             -- Descripción corta para card
  long_desc     TEXT,                             -- Descripción expandida
  price         NUMERIC(10,2) NOT NULL,           -- Precio por unidad/docena
  unit          TEXT DEFAULT 'docena',            -- 'unidad', 'media_docena', 'docena', 'maple'
  category      TEXT NOT NULL,                    -- 'campo_libre', 'organico', 'especial', 'premium'
  image_url     TEXT,                             -- Path en Supabase Storage
  image_alt     TEXT,                             -- Alt text para accesibilidad
  is_featured   BOOLEAN DEFAULT false,            -- Mostrar en hero/destacados
  is_available  BOOLEAN DEFAULT true,             -- Control de stock visible
  sort_order    INTEGER DEFAULT 0,                -- Orden de display
  nutrition     JSONB,                            -- { protein: "6.5g", omega3: "alto", ... }
  origin        TEXT,                             -- "Granja La Aurora, Entre Ríos"
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- Tabla de pedidos/contacto
CREATE TABLE orders (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,                   -- WhatsApp preferido
  customer_email TEXT,
  items         JSONB NOT NULL,                   -- [{ product_id, quantity, unit }]
  notes         TEXT,                             -- Instrucciones especiales
  delivery_zone TEXT,                             -- Zona de entrega
  status        TEXT DEFAULT 'pending',           -- 'pending', 'confirmed', 'delivered'
  total_estimate NUMERIC(10,2),
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- Tabla de mensajes de contacto genéricos
CREATE TABLE contact_messages (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL,
  message       TEXT NOT NULL,
  read          BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT USING (true);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert orders"
  ON orders FOR INSERT WITH CHECK (true);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert messages"
  ON contact_messages FOR INSERT WITH CHECK (true);
```

#### 5.1.2 Productos Iniciales (Seed Data)

| Nombre | Categoría | Precio (ARS) | Unidad | Destacado |
|---|---|---|---|---|
| Huevos de Campo Libre | campo_libre | 4.500 | docena | Sí |
| Huevos Orgánicos Certificados | organico | 6.200 | docena | Sí |
| Huevos Doble Yema | especial | 5.800 | docena | No |
| Maple Premium (30u) | premium | 10.500 | maple | Sí |
| Huevos de Codorniz | especial | 3.200 | docena | No |
| Huevos Pastoriles Omega-3 | premium | 7.400 | docena | No |

> **Nota:** Los precios son referenciales y deben ser editables desde Supabase Dashboard sin intervención de desarrollo.

#### 5.1.3 Componente ProductCard

**Props interface:**

```typescript
interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  unit: 'unidad' | 'media_docena' | 'docena' | 'maple';
  category: string;
  image_url: string;
  image_alt: string;
  is_featured: boolean;
  is_available: boolean;
  nutrition: Record<string, string> | null;
  origin: string;
}

interface ProductCardProps {
  product: Product;
  variant: 'featured' | 'standard' | 'compact';
  onAddToOrder: (product: Product) => void;
}
```

**Estados visuales del card:**
- `default`: Imagen + nombre + precio. Descripción oculta.
- `hover` (desktop): Imagen scale 1.08, descripción se revela con Flip, badge de precio bounce, botón "Agregar" aparece.
- `expanded` (mobile tap): Card se expande verticalmente mostrando descripción completa + botón.
- `unavailable`: Imagen en grayscale (CSS filter), badge "Agotado", sin CTA.

### 5.2 Formulario de Contacto / Pedido

#### 5.2.1 Campos del Formulario

| Campo | Tipo | Validación | Requerido |
|---|---|---|---|
| Nombre completo | `text` | min 2 caracteres | Sí |
| Teléfono (WhatsApp) | `tel` | Regex AR: `+54 9 XX XXXX-XXXX` | Sí |
| Email | `email` | Formato válido | No |
| Productos seleccionados | `multi-select` | Al menos 1 producto si es pedido | Condicional |
| Cantidad por producto | `number` | min 1, max 50 | Condicional |
| Zona de entrega | `select` | Lista predefinida de zonas | No |
| Notas adicionales | `textarea` | max 500 caracteres | No |

#### 5.2.2 Flujo de Envío

```
1. Usuario completa campos → validación client-side (Zod + react-hook-form)
2. Submit → supabase.from('orders').insert(payload)
3. Success → animación de confirmación (check mark animado con GSAP path drawing)
4. Supabase Edge Function (trigger on insert) → envía notificación webhook
5. Error → toast de error con retry, log en console
```

#### 5.2.3 Animación de Confirmación

```javascript
// Path drawing del checkmark
const tl = gsap.timeline();
tl.to('.check-circle', { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' })
  .fromTo('.check-path',
    { strokeDashoffset: 100 },
    { strokeDashoffset: 0, duration: 0.6, ease: 'power2.inOut' }
  )
  .to('.confirmation-text', { opacity: 1, y: 0, duration: 0.4 }, '-=0.2');
```

---

## 6. Requerimientos No Funcionales

### 6.1 Performance — Objetivo 60fps

#### 6.1.1 Optimización de Assets

| Asset | Formato | Compresión | Tamaño Max | Estrategia |
|---|---|---|---|---|
| Hero image/video | WebP (imagen) / MP4 H.265 (video) | Quality 80 / CRF 28 | 200KB img / 2MB video | `<picture>` con fallback JPEG. Video con `poster` frame. |
| Product images | WebP + AVIF (fallback JPEG) | Quality 82 | 80KB cada una | Servidas desde Supabase Storage CDN. Lazy load con `loading="lazy"`. |
| Textures (grain) | PNG con alpha | Tiled (64x64px base) | 5KB | Aplicadas vía CSS `background-image` con `repeat`. |
| Fonts | WOFF2 | — | ~30KB por peso | `font-display: swap`. Preload de pesos críticos (400, 700). |
| Icons | SVG inline o Lucide React | — | < 2KB cada uno | Tree-shaken. No icon fonts. |

#### 6.1.2 Reglas de Animación para 60fps

1. **Solo animar propiedades composited:** `transform` (translate, scale, rotate) y `opacity`. Nunca animar `width`, `height`, `top`, `left`, `margin`, `padding`, `border-width`.
2. **`will-change` selectivo:** Aplicar solo a elementos que están activamente animándose. Remover cuando la animación termina. No usar `will-change: transform` como declaración global.
3. **`force3D: true`** en tweens de GSAP para forzar GPU acceleration (default en GSAP 3+).
4. **Batch DOM reads/writes:** Usar `gsap.utils.toArray()` para referenciar elementos una sola vez. Evitar `querySelectorAll` dentro de callbacks de scroll.
5. **`ScrollTrigger.refresh()`** solo después de cambios de layout (resize, contenido dinámico cargado). No en cada frame.
6. **Lazy initialization:** Las timelines de secciones below-the-fold se crean cuando el usuario se aproxima (usando un ScrollTrigger con `start: 'top bottom+=200px'` como observer).
7. **Video:** `playsinline`, `muted`, `loop`, sin autoplay hasta que el hero sea visible. Pausar cuando sale del viewport.

#### 6.1.3 Bundle Performance

| Métrica | Objetivo | Herramienta de medición |
|---|---|---|
| Lighthouse Performance Score | ≥ 90 | Chrome DevTools |
| First Contentful Paint (FCP) | < 1.5s | Web Vitals |
| Largest Contentful Paint (LCP) | < 2.5s | Web Vitals |
| Cumulative Layout Shift (CLS) | < 0.1 | Web Vitals |
| Total Blocking Time (TBT) | < 200ms | Lighthouse |
| JS Bundle (initial) | < 150KB gzipped | `vite-plugin-visualizer` |
| Total page weight | < 1.5MB (initial load) | Network tab |

### 6.2 SEO Técnico

#### 6.2.1 Meta Tags y Structured Data

```html
<!-- Esenciales -->
<title>Huevos Point — Huevos Premium de Campo Libre | Entrega a Domicilio</title>
<meta name="description" content="Huevos seleccionados de granjas sustentables. 
  Campo libre, orgánicos y especiales. Pedí online con entrega en el día.">
<link rel="canonical" href="https://huevospoint.com.ar">

<!-- Open Graph -->
<meta property="og:title" content="Huevos Point — Premium Egg Retail">
<meta property="og:description" content="...">
<meta property="og:image" content="https://huevospoint.com.ar/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:type" content="website">
<meta property="og:locale" content="es_AR">

<!-- Schema.org / JSON-LD -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Huevos Point",
  "description": "Venta de huevos premium de campo libre y orgánicos",
  "url": "https://huevospoint.com.ar",
  "telephone": "+54-9-11-XXXX-XXXX",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Buenos Aires",
    "addressCountry": "AR"
  },
  "priceRange": "$$",
  "image": "https://huevospoint.com.ar/og-image.jpg",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Catálogo de Huevos",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": "Huevos de Campo Libre"
        }
      }
    ]
  }
}
</script>
```

#### 6.2.2 Consideraciones SPA + SEO

- **Prerendering:** Usar `vite-plugin-prerender` para generar HTML estático de la landing en build time. Al ser SPA de una sola ruta, el prerender cubre el 100% del contenido indexable.
- **Sitemap:** Generar `sitemap.xml` estático con la URL canónica.
- **robots.txt:** Permitir crawling completo. Bloquear `/api/` si se implementa Express.

### 6.3 Accesibilidad (WCAG 2.1 AA)

| Requerimiento | Implementación |
|---|---|
| **Contraste de color** | Ratio mínimo 4.5:1 para body text, 3:1 para headings. Validar `--color-yolk` sobre `--color-bg-primary` (actualmente 7.2:1 — cumple). |
| **Keyboard navigation** | Todos los CTAs y form fields son focusables. Visible focus ring: `outline: 2px solid var(--color-yolk); outline-offset: 4px`. |
| **Screen readers** | Alt text en todas las imágenes. `aria-label` en botones con solo icono. Secciones con `role="region"` y `aria-labelledby`. |
| **Reduced motion** | `@media (prefers-reduced-motion: reduce)` desactiva parallax, stagger y transiciones largas. Los elementos se muestran directamente sin animación. |
| **Form accessibility** | Labels asociados con `htmlFor`. Error messages con `aria-describedby`. Live region para confirmación de envío. |
| **Skip to content** | Link oculto visualmente que salta al `<main>`. Visible en focus. |
| **Semantic HTML** | `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`. Headings en orden jerárquico sin saltos. |

### 6.4 Responsive Design

#### 6.4.1 Breakpoints (Tailwind defaults)

| Breakpoint | Min Width | Contexto |
|---|---|---|
| `sm` | 640px | Móvil grande / landscape |
| `md` | 768px | Tablet portrait |
| `lg` | 1024px | Tablet landscape / laptop |
| `xl` | 1280px | Desktop |
| `2xl` | 1536px | Desktop grande |

#### 6.4.2 Adaptaciones por Dispositivo

| Sección | Mobile (< 768px) | Tablet (768–1024px) | Desktop (> 1024px) |
|---|---|---|---|
| **Hero** | Título 2 líneas, 40–56px. Video reemplazado por imagen estática. CTA full-width. | Título 3 líneas, 48–64px. Video con calidad media. | Título en 1–2 líneas, 80–120px. Video full quality. Parallax multi-capa activo. |
| **Story** | Scroll vertical (sin horizontal pin). Imagen arriba, texto abajo. | Pin parcial con 2 slides. | Pin completo con 3 slides horizontales + parallax. |
| **Products** | Stack vertical, 1 card por fila. Tap para expandir. | Grid 2 columnas uniforme. | Grid asimétrico 60/40. Hover interactions. |
| **Process** | Stepper vertical simple con scroll reveal. Sin pin. | Pin con reduced scroll distance. | Pin completo con scroll distance extendida. |
| **Marquee** | Velocidad reducida. Font size menor. | Velocidad estándar. | Velocidad estándar + hover pause. |
| **Navbar** | Hamburger menu. Full-screen overlay al abrir. | Hamburger o links comprimidos. | Links horizontales visibles. |

#### 6.4.3 Touch Interactions (Mobile)

- **Swipe:** En la story section (modo mobile), habilitar swipe horizontal entre paneles.
- **Tap:** ProductCards responden a tap (no hover). Un tap revela detalles; segundo tap ejecuta CTA.
- **Pull-to-reveal:** Opcional — indicador visual de "deslizá para más" en transiciones de sección.

---

## Apéndice A: Dependencias del Proyecto

```json
{
  "dependencies": {
    "react": "^18.3.x",
    "react-dom": "^18.3.x",
    "gsap": "^3.12.x",
    "@supabase/supabase-js": "^2.x",
    "zustand": "^4.x",
    "react-hook-form": "^7.x",
    "zod": "^3.x",
    "@hookform/resolvers": "^3.x",
    "tailwind-merge": "^2.x",
    "clsx": "^2.x",
    "lucide-react": "^0.383.x"
  },
  "devDependencies": {
    "vite": "^5.x",
    "typescript": "^5.x",
    "@types/react": "^18.x",
    "tailwindcss": "^3.4.x",
    "autoprefixer": "^10.x",
    "postcss": "^8.x",
    "vite-plugin-prerender": "^1.x",
    "vite-plugin-image-optimizer": "^1.x"
  }
}
```

## Apéndice B: Variables de Entorno

```env
# .env.local
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
VITE_SITE_URL=https://huevospoint.com.ar
VITE_WHATSAPP_NUMBER=5491112345678
```

## Apéndice C: Checklist de Lanzamiento

- [ ] Lighthouse score ≥ 90 en las 4 categorías
- [ ] Todos los breakpoints testeados en dispositivos reales (no solo DevTools)
- [ ] Formulario de pedido envía correctamente a Supabase
- [ ] Edge Function de notificación funcional
- [ ] `prefers-reduced-motion` respetado en todas las secciones
- [ ] Open Graph image renderiza correctamente en WhatsApp y redes sociales
- [ ] SSL activo en dominio de producción
- [ ] Supabase RLS policies verificadas (solo INSERT público, no SELECT en orders)
- [ ] GSAP license verificada para uso comercial
- [ ] Fonts self-hosted con licencias correctas
- [ ] Google Analytics / evento tracking implementado
- [ ] Error boundary en React para capturar crashes sin romper la experiencia
