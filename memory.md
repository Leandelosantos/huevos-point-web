# Memoria del proyecto — Huevos Point Web

Registro acumulativo de lo desarrollado. Se agrega al final ante cada comando "Actualizar memoria". No se sobreescribe lo anterior.

---

## Sesión 2026-06-15 — Hero: título "HUEVOS POINT"

**Archivo afectado:** `src/components/sections/HeroSection.tsx`

### Cambios realizados (en orden)
1. Restructuré el título del Hero a una sola línea centrada `"HUEVOS POINT"`, manteniendo refs (`titleRef`, `subtitleRef`, etc.) y animaciones GSAP/`AnimatedText` intactas (`useGSAP`, parallax, `henRef`, eggs, sparkles, CTA).
2. Probé layout con logo (`/images/logo-pin.png`) inline entre "HUEVOS" y "POINT" usando grid `[1fr_auto_1fr]` para centrar el logo con el label "DE LA GRANJA A TU MESA" y el CTA "DESCUBRÍ MÁS" — **descartado**: al usuario no le gustó, se eliminó el logo del título.
3. Estado final del bloque título (líneas ~253-272):
   ```tsx
   <div className="hero-title flex w-full flex-row flex-nowrap items-center justify-center gap-3 text-[clamp(2.8rem,11vw,14rem)] md:gap-5 lg:gap-4 lg:text-[clamp(3rem,12.5vw,17rem)]">
     <div className="overflow-hidden">
       <AnimatedText text="HUEVOS" as="h1" className="block font-panther-outline font-normal leading-[0.88] tracking-[0.01em] text-text-primary text-[clamp(2.8rem,11vw,14rem)] lg:text-[clamp(3rem,12.5vw,17rem)]" delay={0.35} />
     </div>
     <div className="overflow-hidden">
       <AnimatedText text="POINT" as="span" className="block font-panther-outline font-normal leading-[0.88] tracking-[0.01em] text-text-primary text-[clamp(2.8rem,11vw,14rem)] lg:text-[clamp(3rem,12.5vw,17rem)]" delay={0.5} />
     </div>
   </div>
   ```
4. Tamaño tipográfico aumentado progresivamente (~+35% sobre el original `clamp(2.6rem,9.5vw,11rem)`) hasta el máximo que entra en una sola línea sin overflow, verificado con Playwright en 390px, 768px, 1024px (peor caso), 1512px y 1920px.

### Decisiones / restricciones aprendidas
- **Logo `/images/logo-pin.png` debe vivir en `public/images/`** (Vite no sirve archivos en la raíz del repo vía paths root-relative).
- **Centrar "doble" tamaño en una sola línea es matemáticamente imposible**: "HUEVOS"+"POINT" requieren ~7.33× el font-size en ancho; a 20vw eso supera el 100% del viewport en cualquier resolución. Máximo seguro en una línea ≈ 12.5vw / 17rem (verificado sin overflow en 1024px, el breakpoint `lg` más angosto).
- Si se quisiera tamaño realmente doble, la única vía es apilar "HUEVOS" / "POINT" en 2 líneas (layout original pre-sesión) — pendiente, no implementado, usuario eligió mantener una sola línea.
- Para animaciones de entrada por carácter (`AnimatedText`), usar `overflow-hidden` en el wrapper (no `overflow-y-hidden` solo) — Tailwind computa `overflow-x:auto` si solo se define `overflow-y`, lo que puede recortar texto que desborda horizontalmente.

### Estado actual
- Título: una línea, centrado, sin logo, tamaño grande (clamp 11-12.5vw según breakpoint).
- `tsc --noEmit` limpio.
- Pendiente: ninguna tarea abierta sobre el Hero en este momento.

### Cambio externo detectado (no realizado por mí)
- El bloque "Logo — elemento principal, esquina derecha" (`henRef`, `/images/logo.png`, líneas ~184-204) quedó **comentado** en `HeroSection.tsx` por edición del usuario/linter fuera de esta tarea. `henRef` sigue declarado y usado en `useGSAP` (parallax), `isMobile` queda sin uso fuera del bloque comentado — `tsc` no lo marca como error (no hay `noUnusedLocals` estricto o la var se sigue usando en JSX comentado, igual cuenta como referenciada por TS). No se tocó ni revirtió.

---

## Sistema de memoria persistente — setup

- Creado `./memory.md` (este archivo) y agregada sección "Memoria persistente del proyecto" en `CLAUDE.md`:
  - Comando **"Actualizar memoria"** → agregar al final de `memory.md` un resumen de la sesión (sin sobreescribir).
  - Al inicio de sesión / tras compactación → leer `CLAUDE.md` + `memory.md` antes de continuar.

---

## Sesión 2026-06-15 (cont.) — Hero: botón CTA forma de huevo + ajustes título

**Archivo afectado:** `src/components/sections/HeroSection.tsx`, `src/styles/globals.css`

### Cambios realizados (en orden)
1. **Botón "Descubrí más" rediseñado con forma real de huevo**:
   - `.btn-egg` (globals.css) reescrito: ya no usa `border-radius` aproximado, ahora es un `<svg>` de fondo (`btn-egg__shape`) con el mismo `path` de huevo de `EggIllustration`, `viewBox="0 0 100 128"`, `preserveAspectRatio="none"`, relleno `var(--color-yolk)` + `drop-shadow` glow. Tamaño responsive `width: clamp(96px, 8vw, 132px)` + `aspect-ratio: 100/128`. Hover/focus → `scale(1.05)` sobre el SVG.
   - Label (`btn-egg__label`) centrado encima del SVG vía `position: relative; z-index: 1` (sin padding extra, centrado real con flex).
   - Movido el botón **dentro** del bloque título (`titleRef`), debajo de "HUEVOS POINT" — ya no vive en `subtitleRef`.
   - **Eliminado `subtitleRef`** (quedó vacío tras mover el botón) y su `gsap.to` de parallax asociado + import `PARALLAX_HERO_SUBTITLE_SPEED` (ya no existe esa constante referenciada).
2. **Altura tipográfica de "HUEVOS POINT" aumentada** sin tocar ancho (mantiene una sola línea): `transform: scaleY(1.15)` + `origin-bottom` (luego cambiado a `origin-top` por edición externa del usuario, junto con `font-bold` en vez de `font-normal`) en ambos `AnimatedText` (HUEVOS y POINT). Verificado sin overflow/clipping en 390px y 1512px.
3. **Nuevo sub-label "HUEVOS DE VERDAD"** agregado debajo del título (mismo estilo que el label superior "DE LA GRANJA A TU MESA": `font-mono uppercase text-yolk`), con `tracking-[0.5em]` (más separado que el label superior que usa `0.3em`) — pedido explícito de más letter-spacing.

### Cambio externo detectado (no realizado por mí)
- Usuario/linter cambió `origin-bottom` → `origin-top` y `font-normal` → `font-bold` en los `className` de HUEVOS/POINT (líneas ~248, 257) fuera de mis ediciones. No revertido, queda como estado válido actual.

### Estado actual
- Hero: label superior → "HUEVOS POINT" (scaleY 1.15, origin-top, font-bold) → "HUEVOS DE VERDAD" (tracking-0.5em) → botón huevo CTA, todo centrado dentro de `titleRef`.
- `tsc --noEmit` limpio en cada paso.
- Pendiente: ninguna tarea abierta.

---

## Sesión 2026-06-15 (cont. 2) — CTA huevo: animación de quiebre al click

**Archivo afectado:** `src/components/sections/HeroSection.tsx`, `src/styles/globals.css`

### Cambios realizados
- Botón "ROMPER" (label cambiado externamente de "Descubrí más" a "ROMPER"): al click ahora corre una timeline GSAP antes de `scrollToStory()`:
  1. Shake del `<svg>` del huevo (`eggShellRef`, 4 micro-rotaciones ±2-3°, ~0.28s).
  2. Aparece línea de grieta (`eggCrackRef`, zig-zag `EGG_CRACK_LINE`, stroke `var(--color-brand-blue)`, opacity 0→1).
  3. Cascarón se divide en dos mitades (`eggTopRef`/`eggBottomRef`, cada una el mismo path de huevo recortado con `clipPath` — `EGG_CLIP_TOP`/`EGG_CLIP_BOTTOM`, ids únicos vía `useId()`) que se separan (`y`/`x`/`rotation`/`opacity:0`, ~0.5s).
  4. Label (`eggLabelRef`) fade+scale out en paralelo.
  - `onComplete` → `scrollToStory()`, y tras 1.4s (sección ya fuera de vista) `gsap.set(..., { clearProps: 'all' })` + reset de `isBreakingRef` para restaurar el huevo intacto si el usuario vuelve al Hero.
  - `prefersReducedMotion` (hook `usePrefersReducedMotion`) → salta animación, scroll directo.
  - `isBreakingRef` evita doble-click durante la animación.
- CSS: nueva regla `.btn-egg__crack` (stroke azul marca, opacity 0 por defecto).
- Verificado visualmente con Playwright (shake → grieta → mitades separándose) — `tsc --noEmit` limpio.

### Decisión de proceso (pedido explícito del usuario)
- **No correr Playwright tras cada cambio** — solo cuando el usuario lo pida. Documentado en `CLAUDE.md` (nueva sección "Verificación con Playwright"). `tsc --noEmit` sigue obligatorio siempre.

### Estado actual
- CTA Hero: huevo se resquebraja visualmente al click, luego scrollea a `#story`.
- Pendiente: ninguna tarea abierta.

---

## Sesión 2026-06-15 (cont. 3) — Huevo 3D (R3F + GSAP) en botones "ROMPER" y "Hacer mi pedido"

**Archivos afectados:** `src/components/EggScene.tsx`, `src/components/EggCanvas.tsx`, `src/components/sections/HeroSection.tsx`, `src/components/sections/CTASection.tsx`, `src/styles/globals.css`

### Hallazgo clave
- `src/components/EggScene.tsx` y `src/components/EggCanvas.tsx` **ya existían pero no se usaban en ningún lado** (huérfanos de intento previo). Geometría Lathe del huevo + R3F Canvas reutilizados como base.

### Cambios realizados
1. **EggScene.tsx — reescrito**:
   - Quitado `<color attach="background">` (canvas transparente, se ve el fondo del botón).
   - Materiales `MeshPhongMaterial` → `MeshPhysicalMaterial` (cáscara con `clearcoat`, clara con `transmission`/`ior`, yema con `clearcoat`).
   - Primer intento (descartado): apertura "perfecta a la mitad" tipo bisagra + yema cayendo — usuario lo rechazó por poco realista y porque la yema/clara no debían caer.
   - **Versión final**: cáscara intacta (Lathe completo, sin costura) en reposo → al click, partición Voronoi de la superficie en 9 fragmentos irregulares (6 en mobile) mediante grilla (rows×cols) + PRNG determinístico `mulberry32` (semilla fija 1337, **no `Math.random`** — viola regla `react-hooks/purity` en render/useMemo). Cross-fade rápido cáscara→fragmentos (`crackPhase`, p∈[0,0.08]), cada fragmento estalla hacia afuera (dirección = centro normalizado) con spin y delay propios y se desvanece. Yema/clara se asoman brevemente (p∈[0.15,0.6]) y desaparecen junto con todo — el huevo "se resquebraja y desaparece", sin caída de yema.
   - **Importante**: mutar `.material.opacity` vía `meshRef.current.material` (ref), **nunca** vía el objeto devuelto por `useMemo` (`data.xMat.opacity = ...`) — lint `react-hooks/immutability` lo prohíbe.
2. **EggCanvas.tsx**: agregado `gl={{ alpha: true }}`.
3. **HeroSection.tsx (botón "ROMPER")**: `EggCanvas` cargado via `lazy()` + `Suspense`, montado solo tras idle (`requestIdleCallback`/`setTimeout` fallback) y nunca si `prefersReducedMotion` (presupuesto de performance). Fallback: SVG plano simple con `EGG_SHAPE_PATH` relleno `var(--color-yolk)`. `handleEggClick`: shake del wrapper (GSAP, igual que antes) → tween `progress` 0→1 (1.1s, `power2.in`) escrito en `eggProgressRef` (consumido por `EggScene` vía `useFrame`) → fade wrapper+label → `scrollToStory()` → reset tras 1.4s. Eliminados refs/constantes de la versión SVG con clip-paths (mitades + grieta).
4. **CTASection.tsx (botón "Hacer mi pedido")**: mismo patrón replicado 1:1 (lazy EggCanvas, fallback SVG, shake+break+fade, luego `scrollToContact()`). Nuevo botón quedó dentro de `<span ref={eggLabelRef} className="btn-egg__label ...">` envolviendo los dos `<span>` de texto.
5. **globals.css**: eliminada regla `.btn-egg__crack` (ya no hay grieta SVG en ninguno de los dos botones). Nueva clase `.btn-egg--lg` (`width: clamp(140px, 12vw, 200px)`) aplicada solo en CTA para agrandar ese botón sin afectar "ROMPER".
6. **Ajuste de color CTA**: ambos textos del botón ("Hacer" y "mi pedido") ahora `text-yolk` + `group-hover:text-brand-blue transition-colors duration-300` (antes "Hacer" heredaba `text-text-primary` y no cambiaba igual en hover).

### Estado actual
- Ambos botones ("ROMPER" en Hero, "Hacer mi pedido" en CTA) muestran huevo 3D hiperrealista que se resquebraja en fragmentos irregulares y desaparece al click, luego navega a su sección destino.
- `tsc --noEmit` y `eslint` limpios en todos los archivos tocados.
- Pendiente: ninguna tarea abierta. No se verificó visualmente con Playwright (no pedido explícito).

---

## Sesión 2026-06-15 (cont. 4) — Fix: animación de entrada del título "HUEVOS POINT" no se veía

**Archivo afectado:** `src/components/AnimatedText.tsx`

### Diagnóstico
- El `Loader` (`src/components/layout/Loader.tsx`) muestra un preloader de pantalla completa durante `PRELOADER_DURATION = 3s` (curtain split termina ~3.1-3.4s) y recién al `onComplete` hace `setLoading(false)` en `useAppStore`.
- `HeroSection` monta sus `AnimatedText` ("HUEVOS"/"POINT") en paralelo al Loader. La animación de entrada (`gsap.from` con `delay` 0.35/0.5s + `duration` 0.6s + stagger) terminaba en ~1.4s — **mucho antes** de que el curtain se abriera. Resultado: cuando el usuario por fin veía el Hero, el título ya estaba en su posición final, sin animación visible.
- Confirmado visualmente con Playwright (`browser_run_code_unsafe` + screenshots en t=2.9s y t=3.6s tras `goto`): pre-reveal el título está oculto tras el curtain; post-reveal se ve "HUEVOS POINT" con stagger en curso (HUEVOS ya naranja/visible, POINT todavía en fade-in gris→blanco).

### Fix
- `AnimatedText.tsx` ahora lee `isLoading` de `useAppStore` (import `@/stores/useAppStore`).
- Si `isLoading === true`: `gsap.set(chars, { y: 40, opacity: 0 })` — solo fija el estado inicial oculto, sin animar (se "gastaría" detrás del preloader).
- Si `isLoading === false`: corre el `gsap.from(...)` normal (con `delay`/`stagger`/`scrollTrigger` igual que antes).
- `isLoading` agregado a las deps de `useGSAP` → cuando el Loader llama `setLoading(false)` (~3.1-3.4s), el contexto se re-crea y recién ahí dispara la animación de entrada.
- Único componente que usa `AnimatedText` es `HeroSection` (título "HUEVOS"/"POINT") — sin impacto en otras secciones.

### Estado actual
- `tsc --noEmit` limpio. Verificado visualmente con Playwright (capturas temporales eliminadas tras la verificación).
- Pendiente: ninguna tarea abierta.

---

## Sesión 2026-06-16 — Marquee superior, tipografía Oswald, responsive, Process y Products

### Marquee superior rediseñado
- `src/components/Marquee.tsx` reescrito: array de palabras + `EggIllustration` (variant cream, rotación alterna ±8°) entre cada palabra. Tipografía `font-display font-black clamp(2rem,6vw,5rem)`, fondo `bg-yolk`, texto `text-bg-primary`.
- `src/constants/business.ts`: `MARQUEE_TEXT` → `MARQUEE_WORDS` (array: HUEVOS POINT, FRESCURA, DE LA GRANJA, PREMIUM).
- `src/App.tsx`: prop `words={MARQUEE_WORDS}`, `className="py-6 bg-yolk md:py-10"`.
- Verificado responsive 320/390/768/1920px con Playwright — sin overflow horizontal causado por marquee (overflow preexistente de 408px es el decorativo del Hero, no relacionado).

### Tipografía Oswald aplicada a todo el proyecto
- `public/fonts/Oswald/Oswald-VariableFont_wght.ttf` registrada en `src/styles/fonts.css` (weight 100–900).
- `tailwind.config.ts`: alias `display`, `heading`, `body`, `mono` → todos apuntan a `['Oswald', 'sans-serif']`. Nuevo alias `oswald` también disponible. Los pesos (bold, black, normal) se controlan por clases Tailwind existentes en cada componente.
- `src/components/PerspectiveMarquee.tsx`: inline `fontFamily` `'Playfair Display, serif'` → `'Oswald, sans-serif'`.
- `HeroSection`: título HUEVOS/POINT → `font-oswald font-bold`, tracking-[0.16em], gap-8 (2rem). Sub-labels "De la granja a tu mesa" y "Huevos de verdad" → `font-oswald font-normal`.

### Auditoría responsive/mobile (sin Playwright)
Bugs ALTA corregidos:
- `ProductsSection.tsx` h2: `text-9xl` → `text-4xl sm:text-6xl lg:text-9xl`, contenedor `w-fit` → `w-full md:w-fit md:mx-auto`.
- `CTASection.tsx` h2: `text-9xl` → `text-4xl sm:text-6xl lg:text-9xl`, párrafo `text-3xl` → `text-lg sm:text-2xl lg:text-3xl`.
- `Navbar.tsx`: overlay `px-12` → `px-6 sm:px-12 lg:px-24`.
- `ProductsSection.tsx` h2: `font-heading` → `font-panther-bold` (pedido explícito).

### ProcessSection — centrado al scrollear
- Bug: steps usaban `top-1/2 -translate-y-1/2` (CSS transform) pero GSAP overrideaba ese transform con `translateY(40px)` inicial, anulando el −50% y dejando content en la mitad inferior del viewport.
- Fix: container `h-56 relative` → `h-screen flex items-center` (centrado por flexbox, no por transform). Steps: `top-1/2 -translate-y-1/2` → `inset-y-0` (top-0 bottom-0, centrado por flex del parent).
- Label "PROCESO" movido de `absolute -top-16` (flotaba fuera de sección con h-screen) a dentro de cada step content (sobre el step-counter), visible junto a cada descripción.

### ProductsSection — header centrado + ilustraciones reposicionadas
- Header: `max-w-8xl` (no existe en Tailwind) → `max-w-4xl text-center mx-auto`, `items-start` eliminado, `mt-16` → `mt-6`.
- Ilustraciones reposicionadas fuera del área central (19%–81%):
  - HoneyJar: `left-[52%]` → `right-[2%]`
  - YerbaPackage: `left-[28%]` → `right-[3%]`

### TomatoBottle — nueva ilustración
- Creada `src/components/illustrations/TomatoBottle.tsx`: SVG editorial estilo consistente (stroke #292524, sw 1.8, colores rojo tomate + cream + amber, sticker con tomate ilustrado, reflejo lateral).
- Agregada en `ProductsSection` en `right-[8%] top-[580px]` — espejo del NutsJar (`left-[8%]`). Ref `tomatoRef` wired con reveal GSAP y parallax.

### Estado actual
- `tsc --noEmit` limpio en todos los cambios.
- Pendiente: ninguna tarea abierta.

---

## Sesión 2026-06-16 — ContactSection, HeroSection, StorySection

### ContactSection — formulario sin restricción de productos + logo + huevo 3D
- Eliminado bloque "Agregá productos..." (reminder) y condición `orderItems.length === 0` del `disabled` del botón submit.
- Schema Zod: `items: z.array(orderItemSchema).min(1, ...)` → `z.array(orderItemSchema)` (sin mínimo).
- Logo `sinbg.png` copiado a `public/images/logo-sinbg.png` y agregado en columna izquierda del form (`mx-auto w-60 opacity-80`).
- **Botón submit reemplazado por huevo 3D** (mismo patrón que HeroSection):
  - `lazy(() => import('@/components/EggCanvas'))` + `Suspense`, montado tras `requestIdleCallback`.
  - `handleEggClick`: form inválido → shake del huevo sin romper + dispara validación (muestra errores en campos); form válido → shake + break animation → `handleSubmit(onSubmit)()` al `onComplete`; `prefersReducedMotion` → submit directo.
  - Texto "Enviar pedido" → `"ENVIAR"` en `text-brand-blue` (#004aad) sobre yolk.
  - `MagneticButton` con clase `btn-egg`, fallback SVG plano.

### HeroSection — spacing tipográfico
- `mt-[0.12em]` en `.hero-title` div para igualar visualmente el espacio sobre "HUEVOS POINT" con el espacio debajo. La asimetría viene de `leading-[0.88]` en Oswald all-caps: ~0.04em sobre caps vs ~0.14em bajo baseline en el line box. El `mt` escala con el font-size del div (clamp), compensando correctamente en todos los breakpoints.

### StorySection — título "No es solo un huevo" visible en desktop
- Problema: `<div className="px-6 pt-section md:hidden">` ocultaba "Nuestra historia / No es solo un huevo" en desktop.
- Solución: título agregado en el **primer panel** (index===0) como elemento en flujo (no absolute), cambiando ese panel a `flex-col items-center justify-center gap-6 py-10` para que título + grid estén apilados sin overlap.
- Label del primer panel: `'Nuestra historia'` → `'01'` (consistente con paneles 2 y 3).
- Font-size del título: `clamp(2rem, 4vw, 4rem)` (fluido, responsive).
- Intentos previos descartados:
  1. `absolute top-10` dentro del wrapper del track → rompió el scroll horizontal (interferencia con GSAP).
  2. `absolute top-10` dentro del primer panel → overlap visual con la imagen del grid.
- Fix final: panel index===0 con `flex-col` en vez de `items-center`, título en flujo antes del grid.
- Verificado con Playwright: sin overlap, scroll horizontal funcionando, texto de Origen animado correctamente.

### Estado actual
- `tsc --noEmit` limpio en todos los cambios.
- Pendiente: ninguna tarea abierta.

---

## Sesión 2026-06-16 (continuación) — StorySection: fix alineación + tamaño título

### Problema raíz detectado con Playwright
- El panel index===0 con `flex-col justify-center gap-6 py-10` desplazaba la imagen 71px hacia abajo (top: 263.85px) vs paneles 1 y 2 (top: 192.5px). Desalineamiento confirmado con medición directa de `.story-image` getBoundingClientRect en los 3 paneles.

### Fix alineación — StorySection.tsx
- Revertido panel index===0 a `items-center` (igual que paneles 1 y 2).
- Título movido de en-flujo a `absolute inset-x-0 top-6 z-20 text-center` → no afecta centrado flexbox del grid → las 3 imágenes quedan en `top: 192.5px` (alineadas exactamente).
- Verificación: title bottom=158.7px, image top=192.5px, sin solapamiento (gap=33.8px).

### Aumento de tamaño del título
- `p` "Nuestra historia": `text-sm` (14px) → `text-base` (16px).
- `h2` "No es solo un huevo": `clamp(2rem, 4vw, 4.5rem)` → `clamp(2.5rem, 5.5vw, 6rem)` + `leading-tight`.
- Posición: `top-10` → `top-6` (navbar height=0 en StorySection, sin riesgo de solapamiento).
- Resultado medido: h2=83.16px (+37%), title bottom=159.9px, gap=32.6px ✓.

### Espacio entre título e imágenes — solución estructural
- Problema: título `absolute` → `margin-bottom` no empuja imágenes (no participan del flujo).
- Solución: `pt-20` (5rem=80px) en **todos** los paneles del track. Centrado flexbox desplaza imágenes: (862-80-477)/2 + 80 = 232.5px → shift +40px. Aplicado a todos los paneles → alineación preservada.
- Resultado: gap título→imagen de 32.6px → **48.6px**. Todas las imágenes en `top: 232.5px` ✓.

### Carrusel ProductsSection — diagnóstico
- `RadialScrollGallery` funcionaba correctamente: 6 cards, `rotate(180deg)` a 50% del rango de scroll. El falso positivo `wheelChildren: 4` inicial apuntaba al navbar `<ul>`, no a la rueda.

### Estado final
- Panel 0 layout: `items-center` (= paneles 1,2) + `pt-20`.
- Título: `absolute top-6`, p `text-base`, h2 `clamp(2.5rem, 5.5vw, 6rem)` `leading-tight`.
- `tsc --noEmit` limpio. Pendiente: ninguna tarea abierta.
