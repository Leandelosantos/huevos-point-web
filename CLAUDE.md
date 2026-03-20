# CLAUDE.md — Huevos Point Web

## Idioma
Siempre responder en español latinoamericano (Argentina). Sin excepciones.

## Proyecto
Landing page SPA premium scroll-driven para Huevos Point (Premium Egg Retail).
Leer el SRS completo antes de cualquier tarea: `./SRS_HuevosPointWeb.md`

## Stack
- React 18 + Vite + TypeScript
- GSAP 3 + ScrollTrigger (único engine de animación — nunca usar CSS animations para secuencias complejas)
- Supabase (PostgreSQL + Storage + Edge Functions)
- Zustand (solo UI state y form state — nunca para datos de servidor)
- Tailwind CSS + Shadcn/UI
- react-hook-form + Zod
- Express.js solo si Supabase Edge Functions no cubren el requerimiento

## Estructura de archivos
Respetar estrictamente la estructura definida en el SRS sección 2.3.
No crear archivos fuera de esa estructura sin confirmar primero.

## Base de datos (Supabase)
- Tablas: `products`, `orders`, `contact_messages`
- RLS activo:
  - `products` → SELECT público permitido
  - `orders` → solo INSERT público
  - `contact_messages` → solo INSERT público
- Antes de cualquier migración: mostrar el SQL completo y esperar confirmación explícita
- Nunca exponer `service_role` key en el cliente

## Reglas de animación (crítico para 60fps)
- Solo animar `transform` y `opacity`. NUNCA `width`, `height`, `top`, `left`, `margin`, `padding`
- `will-change` solo en elementos activamente animándose — removerlo al terminar
- `force3D: true` en todos los tweens de GSAP
- Respetar siempre `prefers-reduced-motion`
- ScrollTrigger: inicializar timelines de secciones below-the-fold solo cuando el usuario se aproxima
- Pausar video cuando sale del viewport

## Paleta de colores
Usar exclusivamente las variables CSS definidas en el SRS sección 3.2:
- Fondo: `--color-bg-primary` (#0C0A09), `--color-bg-secondary` (#1C1917)
- Acento: `--color-yolk` (#F59E0B)
- Texto: `--color-text-primary` (#FAFAF9), `--color-text-secondary` (#A8A29E)
Proporción 70-20-10: fondos oscuros / neutros / acento yolk

## Tipografía
- Display/Hero: Playfair Display (700, 900)
- Headings: Instrument Serif (400)
- Body/UI: Satoshi (400, 500, 700)
- Labels/Precios: JetBrains Mono (400)
- Usar `clamp()` para fluid typography según el SRS sección 3.3

## Skills disponibles
Están en `.claude/skills/` — consultarlas antes de ejecutar tareas relacionadas:

| Skill | Cuándo usarla |
|---|---|
| `senior-architect` | Decisiones de arquitectura, diagramas, estructura |
| `senior-backend` | APIs, lógica de servidor, autenticación |
| `senior-devops` | Deploy, CI/CD, variables de entorno |
| `senior-qa` | Tests, edge cases, regresiones |
| `senior-security` | RLS, validaciones, exposición de datos |
| `code-reviewer` | Revisión de código, PRs, antipatterns |
| `seo-optimizer` | Meta tags, structured data, Core Web Vitals |
| `mobile-design` | Responsive, touch interactions, mobile UX |
| `scroll-experience` | GSAP, ScrollTrigger, parallax, animaciones |
| `ui-ux-pro-max` | Design system, componentes, tipografía |
| `remotion` | Video programático si se requiere |
| `supabase-postgres-best-practices` | Migraciones, queries, RLS, Storage |

## Cuándo actuar vs preguntar
**Actuar solo:**
- Componentes, estilos, hooks, animaciones GSAP
- Lógica de formularios y validaciones
- Tests unitarios y de integración

**Preguntar siempre:**
- Migraciones SQL o cambios en RLS
- Instalación de dependencias nuevas no listadas en el SRS
- Cambios que afecten la arquitectura definida en el SRS sección 2.2
- Cualquier operación irreversible

**Nunca tocar sin confirmación explícita:**
- `.env.local`
- Políticas RLS en producción
- Archivos de configuración raíz (`vite.config.ts`, `tsconfig.json`, `tailwind.config.ts`)

## Performance — objetivos no negociables
- Lighthouse Performance Score ≥ 90
- LCP < 2.5s / FCP < 1.5s / CLS < 0.1 / TBT < 200ms
- JS Bundle inicial < 150KB gzipped
- Peso total inicial < 1.5MB

## Commits
- Conventional commits: `feat:`, `fix:`, `chore:`, `style:`, `refactor:`
- Mensajes en español
- Un commit por tarea completada — no agrupar cambios no relacionados

## Aprendizaje continuo
Cuando se resuelva un problema no trivial, registrarlo en `~/.claude/lessons.md`:
- **Problema:** descripción breve
- **Solución:** qué funcionó
- **Contexto:** stack / sección del proyecto
