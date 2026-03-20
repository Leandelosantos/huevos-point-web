---
name: senior-architect
description: Comprehensive software architecture skill for designing scalable, maintainable systems using ReactJS, NextJS, NodeJS, Express, React Native, Swift, Kotlin, Flutter, Postgres, GraphQL, Go, Python. Includes architecture diagram generation, system design patterns, tech stack decision frameworks, and dependency analysis. Use when designing system architecture, making technical decisions, creating architecture diagrams, evaluating trade-offs, or defining integration patterns.
---

# Senior Architect

Complete toolkit for senior architect with modern tools and best practices.

## Quick Start

### Main Capabilities

This skill provides three core capabilities through automated scripts:

```bash
# Script 1: Architecture Diagram Generator
python scripts/architecture_diagram_generator.py [options]

# Script 2: Project Architect
python scripts/project_architect.py [options]

# Script 3: Dependency Analyzer
python scripts/dependency_analyzer.py [options]
```

## Core Capabilities

### 1. Architecture Diagram Generator

Automated tool for architecture diagram generator tasks.

**Features:**
- Automated scaffolding
- Best practices built-in
- Configurable templates
- Quality checks

**Usage:**
```bash
python scripts/architecture_diagram_generator.py <project-path> [options]
```

### 2. Project Architect

Comprehensive analysis and optimization tool.

**Features:**
- Deep analysis
- Performance metrics
- Recommendations
- Automated fixes

**Usage:**
```bash
python scripts/project_architect.py <target-path> [--verbose]
```

### 3. Dependency Analyzer

Advanced tooling for specialized tasks.

**Features:**
- Expert-level automation
- Custom configurations
- Integration ready
- Production-grade output

**Usage:**
```bash
python scripts/dependency_analyzer.py [arguments] [options]
```

## Reference Documentation

### Architecture Patterns

Comprehensive guide available in `references/architecture_patterns.md`:

- Detailed patterns and practices
- Code examples
- Best practices
- Anti-patterns to avoid
- Real-world scenarios

### System Design Workflows

Complete workflow documentation in `references/system_design_workflows.md`:

- Step-by-step processes
- Optimization strategies
- Tool integrations
- Performance tuning
- Troubleshooting guide

### Tech Decision Guide

Technical reference guide in `references/tech_decision_guide.md`:

- Technology stack details
- Configuration examples
- Integration patterns
- Security considerations
- Scalability guidelines

## Tech Stack

**Languages:** TypeScript, JavaScript, Python, Go, Swift, Kotlin
**Frontend:** React, Next.js, React Native, Flutter
**Backend:** Node.js, Express, GraphQL, REST APIs
**Database:** PostgreSQL, Prisma, NeonDB, Supabase
**DevOps:** Docker, Kubernetes, Terraform, GitHub Actions, CircleCI
**Cloud:** AWS, GCP, Azure

## Development Workflow

### 1. Setup and Configuration

```bash
# Install dependencies
npm install
# or
pip install -r requirements.txt

# Configure environment
cp .env.example .env
```

### 2. Run Quality Checks

```bash
# Use the analyzer script
python scripts/project_architect.py .

# Review recommendations
# Apply fixes
```

### 3. Implement Best Practices

Follow the patterns and practices documented in:
- `references/architecture_patterns.md`
- `references/system_design_workflows.md`
- `references/tech_decision_guide.md`

## Best Practices Summary

### Code Quality
- Follow established patterns
- Write comprehensive tests
- Document decisions
- Review regularly

### Performance
- Measure before optimizing
- Use appropriate caching
- Optimize critical paths
- Monitor in production

### Security
- Validate all inputs
- Use parameterized queries
- Implement proper authentication
- Keep dependencies updated

### Maintainability
- Write clear code
- Use consistent naming
- Add helpful comments
- Keep it simple

## Common Commands

```bash
# Development
npm run dev
npm run build
npm run test
npm run lint

# Analysis
python scripts/project_architect.py .
python scripts/dependency_analyzer.py --analyze

# Deployment
docker build -t app:latest .
docker-compose up -d
kubectl apply -f k8s/
```

## Troubleshooting

### Common Issues

Check the comprehensive troubleshooting section in `references/tech_decision_guide.md`.

### Getting Help

- Review reference documentation
- Check script output messages
- Consult tech stack documentation
- Review error logs

## Resources

- Pattern Reference: `references/architecture_patterns.md`
- Workflow Guide: `references/system_design_workflows.md`
- Technical Guide: `references/tech_decision_guide.md`
- Tool Scripts: `scripts/` directory

---

## Huevos Point — Project Context

**Proyecto:** Landing page SPA premium scroll-driven para venta de huevos premium (Premium Egg Retail).
**Stack:** React 18 + Vite + TypeScript strict · GSAP 3 (ScrollTrigger, Flip, TextPlugin) · Supabase (BaaS) · Tailwind CSS + Shadcn/UI · Zustand

### Arquitectura de capas (superior depende de inferior, nunca al revés)

```
Presentación (components/sections/) → Lógica UI (hooks/) → Servicios (services/) → Estado (stores/) → Tipos+Config → Supabase
```

### Decisiones arquitectónicas tomadas (no reabrir)

| Decisión | Justificación |
|----------|---------------|
| SPA con React + Vite | HMR nativo, tree-shaking, chunks granulares para lazy loading por sección |
| GSAP como engine único | Control total sobre timelines, scrub preciso, superior a CSS animations para secuencias complejas |
| Supabase sobre Firebase | PostgreSQL nativo, RLS integrado, Storage CDN, Edge Functions Deno |
| Zustand sobre Redux | ~1KB, sin boilerplate, compatible con React 18 concurrent features |
| Express.js condicional | Solo si Supabase Edge Functions no cubren proxy CORS, rate limiting o SSR parcial |

### Estructura de directorios definida (SRS §2.3)

```
src/
├── components/layout/ sections/ ui/   # Presentación
├── hooks/                              # useGSAP, useProducts, useOrderSubmit
├── services/                           # products.ts, orders.ts, contact.ts
├── lib/                                # supabase.ts, gsap-config.ts, utils.ts
├── stores/                             # useAppStore.ts (Zustand)
├── styles/                             # globals.css, fonts.css, animations.css
├── types/                              # Product, Order, OrderPayload (Zod schemas)
├── constants/                          # animation.ts, business.ts
supabase/migrations/ functions/ seed.sql
```

### Patrones obligatorios

- **Repository Pattern:** Toda interacción con Supabase en `services/`. Componentes NUNCA llaman `supabase.from()` directamente.
- **Strategy Pattern (animaciones responsive):** `getStrategy(isMobile, isTablet)` → `'pinHorizontal' | 'pinPartial' | 'verticalSimple'`
- **Observer/Event-Driven:** Submit de pedido solo persiste datos. Efectos secundarios separados: animación confirmación, reset form, notificación Edge Function.
- **SRP:** >150 líneas en .tsx o >50 en hook = dividir.

### Tablas Supabase

- `products` — catálogo (SELECT público, sin INSERT/UPDATE/DELETE público)
- `orders` — pedidos (INSERT público, sin SELECT público)
- `contact_messages` — mensajes (INSERT público, sin SELECT público)

### Secciones de la SPA (en orden)

Preloader → Hero (parallax multi-capa) → Story (pin horizontal 3 slides) → Products (grid asimétrico) → Process (pin stepper 4 pasos) → Contact/CTA (fondo cream) → Footer (marquee)
