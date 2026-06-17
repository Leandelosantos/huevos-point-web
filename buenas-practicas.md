---
trigger: always_on
---

# Regla: Huevos Point — Buenas Prácticas de Desarrollo
Stack: React 18+Vite · GSAP 3 (ScrollTrigger,Flip,TextPlugin) · Supabase+PostgreSQL · Tailwind+Shadcn/UI · Zustand

## 1. Principios
- **S**: Un componente/hook hace una sola cosa. `ProductCard.tsx` renderiza; `useProducts.ts` fetchea; `useProductReveal.ts` anima. >150 líneas en .tsx o >50 en hook = dividir.
- **O**: Agregar sección animada no requiere tocar `App.tsx` ni `gsap-config.ts`. Cada sección registra sus timelines vía `useGSAP()`.
- **D**: Hooks reciben el cliente Supabase como parámetro/contexto, no importan `supabase.ts` directamente. Permite testing con mocks.
- **DRY**: Lógica compartida en `lib/utils.ts` (formatPrice, cn). Un solo `Marquee.tsx` reutilizable.
- **KISS**: Zustand sobre Redux (estado mínimo). Supabase sobre Express propio (sin lógica compleja). CSS transition antes que GSAP si alcanza.
- **YAGNI**: Sin carrito, pasarela, sistema de usuarios ni admin panel. Catálogo se edita desde Supabase Dashboard.
- **Fail Fast**: Zod valida en cliente antes de tocar Supabase. Verificar `error` en toda respuesta antes de asumir éxito.
- **SoC**: Presentación→`components/` | Lógica→`hooks/` | Datos→`services/` | Animación→hooks GSAP | Estado→`stores/` | Config→`.env`+`lib/` | Tipos→`types/`

## 2. Código Limpio
**Nomenclatura obligatoria:**
- Variables/funciones: `camelCase` | Componentes: `PascalCase` | Constantes: `UPPER_SNAKE_CASE` | Hooks: `use`+PascalCase | CSS vars: `--kebab-case` | DB tables/cols: `snake_case`
- Nombres descriptivos. Prohibido: `data`, `res2`, `temp`, `x`, `flag`.

**Funciones:** max 3 params; si más, usar objeto tipado. Nombres como verbos: `fetchProducts()`, `validateOrderPayload()`, `createMarqueeTimeline()`.

**Comentarios:** Solo el *por qué*, nunca el *qué*. Código comentado se elimina antes del commit.

**Errores:** Nunca `catch(e) {}` vacío. Usar clases personalizadas (`OrderSubmitError`, `AnimationInitError`). Siempre feedback al usuario (toast) + logging con prefijo `[ModuleName]`.

**Sin números mágicos:** Toda constante en `constants/animation.ts` (`PRELOADER_DURATION`, `STAGGER_CARD_REVEAL`, `PARALLAX_HERO_SPEED`) y `constants/business.ts` (`MAX_ORDER_QUANTITY`, `PHONE_REGEX_AR`, `MAX_NOTE_LENGTH`).

## 3. Arquitectura
**Capas (superior depende de inferior, nunca al revés):**
```
Presentación (components/sections/) → Lógica UI (hooks/) → Servicios (services/) → Estado (stores/) → Tipos+Config → Supabase
```
Un componente NUNCA hace `supabase.from('products').select()` directamente.

**Repository Pattern:** Toda interacción con Supabase en `services/products.ts`, `services/orders.ts`. Hooks consumen servicios, no la DB.

**Strategy Pattern para animaciones responsive:**
```
getStrategy(isMobile, isTablet) → 'pinHorizontal' | 'pinPartial' | 'verticalSimple'
```
Cada strategy es una función que retorna un `gsap.core.Timeline`. Sin condicionales dispersos.

**Observer/Event-Driven:** Submit de pedido solo persiste datos. Efectos secundarios separados: animación de confirmación (UI), reset form (form), tracking (analytics), notificación (Edge Function vía DB trigger).

**Estructura de directorios:**
```
src/
├── components/layout/ sections/ ui/   # Presentación
├── hooks/                              # useGSAP, useProducts, useOrderSubmit
├── services/                           # products.ts, orders.ts, contact.ts
├── lib/                                # supabase.ts, gsap-config.ts, errors.ts, utils.ts
├── stores/                             # useAppStore.ts (Zustand)
├── styles/                             # globals.css, fonts.css, animations.css
├── types/                              # Product, Order, OrderPayload (Zod schemas)
├── constants/                          # animation.ts, business.ts
supabase/migrations/ functions/ seed.sql
```

## 4. Frontend
- Componentes funcionales con TypeScript strict. No `any`. Interfaces explícitas para props y datos.
- Separar lógica de presentación: lógica en hooks, componente solo renderiza.
- No `useState` para valores derivables → `useMemo`. Ej: `availableProducts = useMemo(() => products.filter(p => p.is_available), [products])`.
- **Cleanup obligatorio de GSAP:** Todo timeline dentro de `useGSAP()` que usa `gsap.context()` para revert automático en unmount. Esto previene memory leaks y animaciones zombi.
- **Formularios:** React Hook Form + Zod. Validación `mode:'onChange'`. Submit deshabilitado durante envío. Honeypot field contra spam.
- Prop drilling max 2 niveles → Zustand para estado compartido (activeSection, orderItems, isMenuOpen).
- Llamadas a Supabase centralizadas en `services/`. Nunca dispersas en componentes.

## 5. Backend (Supabase + Express condicional)
**Supabase es el backend primario.** Express solo si se necesita proxy CORS, SSR parcial o rate limiting avanzado.

**RLS obligatorio:**
- `products`: SELECT público. Sin INSERT/UPDATE/DELETE público.
- `orders` y `contact_messages`: INSERT público. Sin SELECT público.
- Datos sensibles solo accesibles vía `service_role_key` (nunca en cliente).

**Edge Functions:** `notify-order` se dispara vía DB webhook al insertar en orders → notifica a WhatsApp.

**Variables de entorno:** `.env.local` en `.gitignore`. `VITE_` prefix para vars del cliente. `.env.example` en el repo sin valores reales. `service_role_key` NUNCA en el frontend.

**Logging:** `console.error('[Prefijo]', error)` con contexto. Prohibido `console.log` suelto.

## 6. Base de Datos
- Toda tabla: `id` UUID PK, `created_at`, `updated_at`.
- CHECK constraints como última línea de defensa: `unit IN ('unidad','media_docena','docena','maple')`, `status IN ('pending','confirmed','delivered','cancelled')`, `char_length(notes) <= 500`.
- Índices en columnas de WHERE/ORDER BY. Índices parciales donde aplique (`WHERE is_featured = true`).
- Eliminación lógica: `is_available` en products. Nunca borrar datos con historial.
- Migraciones versionadas en `supabase/migrations/`. Nunca modificar prod manualmente.
- Sin concatenación de strings en queries. SDK de Supabase genera prepared statements.

## 7. Seguridad
- XSS: React escapa por defecto. No `dangerouslySetInnerHTML`.
- SQL injection: SDK de Supabase con prepared statements.
- Spam: Honeypot field + rate limiting (Supabase o Cloudflare).
- CORS: Solo dominio de producción autorizado.
- Headers: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`.
- HTTPS obligatorio en producción.
- Validación doble: Zod (frontend UX) + CHECK constraints (DB seguridad).

## 8. UX/UI
- **Feedback constante:** Preloader con counter 0→100%. Submit con estado "Enviando...". Confirmación con check animado (GSAP path drawing).
- **Jerarquía tipográfica:** Playfair 80-120px (hero) → Instrument 40-64px (headings) → Satoshi 16-18px (body) → JetBrains Mono 11-13px (labels/precios).
- **Paleta 70-20-10:** 70% fondos oscuros (#0C0A09, #1C1917) | 20% texto neutro (#FAFAF9, #A8A29E) | 10% acento yolk (#F59E0B) solo en CTAs y highlights.
- **Espaciado:** Múltiplos de 8px. Min 120px entre secciones.
- **Responsive mobile-first:** Desde 320px. Táctiles ≥44x44px. ProductCards: stack vertical + tap en mobile, grid asimétrico + hover en desktop. Story: scroll vertical simple en mobile, pin horizontal en desktop.
- **Accesibilidad:** Contraste WCAG AA (4.5:1 body, 3:1 headings). Focus ring `outline: 2px solid var(--color-yolk)`. Alt text obligatorio. Labels con `htmlFor`. Skip-to-content. Semantic HTML. `prefers-reduced-motion` respetado.

## 9. GSAP — Reglas de 60fps
1. **Solo `transform` y `opacity`.** Nunca `width`, `height`, `top`, `left`, `margin`.
2. **`will-change` selectivo.** Aplicar solo durante animación activa, remover al completar.
3. **DOM queries cacheadas:** `gsap.utils.toArray()` una vez. Nunca `querySelectorAll` en callbacks de scroll.
4. **Lazy init:** Animaciones below-the-fold se crean al acercarse (`start: 'top bottom+=200'`, `once: true`).
5. **`ScrollTrigger.matchMedia()`:** Desktop=parallax+pin completo. Mobile=fade reveals simples. `prefers-reduced-motion`=instantáneo (`timeScale(100)`).
6. **`ScrollTrigger.refresh()`** solo tras cambios de layout (resize, contenido dinámico). No en cada frame.
7. **Cleanup:** Toda timeline dentro de `gsap.context()` vía `useGSAP()`. Revert automático en unmount.
8. **Video:** `playsinline muted loop`, pausar fuera del viewport.

## 10. Testing y Git
**Tests:** Unitarios (formatPrice, schemas Zod, Zustand store) → Integración (useOrderSubmit con mock Supabase) → E2E (scroll→agregar→formulario→enviar→confirmar). Patrón AAA.

**Git branches:** `main`(prod) / `develop` / `feature/xxx` / `fix/xxx` / `hotfix/xxx`
**Commits:** `feat:`, `fix:`, `refactor:`, `perf:`, `style:`, `docs:`, `chore:`. PRs max 400 líneas. Nunca commitear `.env.local`.

## 11. Checklist
**Código:** □ Sin duplicación □ SRP en funciones/hooks □ Sin magic numbers □ Errores manejados □ Sin console.log □ Credenciales en .env □ TS strict, no any
**GSAP:** □ useGSAP() con cleanup □ Solo transform+opacity □ will-change selectivo □ DOM cacheado □ matchMedia mobile/desktop □ reduced-motion □ ≥55fps □ Lazy init
**Seguridad:** □ RLS activo □ Zod+CHECK constraints □ Honeypot □ CORS restrictivo □ HTTPS □ Headers seguridad □ service_role_key oculta
**UX:** □ Mobile+tablet+desktop □ 4 estados (carga/éxito/error/vacío) □ Validación onChange □ Submit deshabilitado durante envío □ Contraste WCAG AA □ Focus ring □ Alt text □ Táctiles ≥44px
**Performance:** □ Lighthouse ≥90 □ LCP<2.5s FCP<1.5s CLS<0.1 TBT<200ms □ Bundle<150KB gz □ Imágenes WebP/AVIF □ Fonts WOFF2 swap
**Deploy:** □ Auto-deploy main □ .env.example en repo □ Migrations versionadas □ OG image ok □ SSL □ GSAP license □ Analytics □ Error boundary