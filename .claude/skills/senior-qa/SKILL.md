---
name: senior-qa
description: Comprehensive QA and testing skill for quality assurance, test automation, and testing strategies for ReactJS, NextJS, NodeJS applications. Includes test suite generation, coverage analysis, E2E testing setup, and quality metrics. Use when designing test strategies, writing test cases, implementing test automation, performing manual testing, or analyzing test coverage.
---

# Senior Qa

Complete toolkit for senior qa with modern tools and best practices.

## Quick Start

### Main Capabilities

This skill provides three core capabilities through automated scripts:

```bash
# Script 1: Test Suite Generator
python scripts/test_suite_generator.py [options]

# Script 2: Coverage Analyzer
python scripts/coverage_analyzer.py [options]

# Script 3: E2E Test Scaffolder
python scripts/e2e_test_scaffolder.py [options]
```

## Core Capabilities

### 1. Test Suite Generator

Automated tool for test suite generator tasks.

**Features:**
- Automated scaffolding
- Best practices built-in
- Configurable templates
- Quality checks

**Usage:**
```bash
python scripts/test_suite_generator.py <project-path> [options]
```

### 2. Coverage Analyzer

Comprehensive analysis and optimization tool.

**Features:**
- Deep analysis
- Performance metrics
- Recommendations
- Automated fixes

**Usage:**
```bash
python scripts/coverage_analyzer.py <target-path> [--verbose]
```

### 3. E2E Test Scaffolder

Advanced tooling for specialized tasks.

**Features:**
- Expert-level automation
- Custom configurations
- Integration ready
- Production-grade output

**Usage:**
```bash
python scripts/e2e_test_scaffolder.py [arguments] [options]
```

## Reference Documentation

### Testing Strategies

Comprehensive guide available in `references/testing_strategies.md`:

- Detailed patterns and practices
- Code examples
- Best practices
- Anti-patterns to avoid
- Real-world scenarios

### Test Automation Patterns

Complete workflow documentation in `references/test_automation_patterns.md`:

- Step-by-step processes
- Optimization strategies
- Tool integrations
- Performance tuning
- Troubleshooting guide

### Qa Best Practices

Technical reference guide in `references/qa_best_practices.md`:

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
python scripts/coverage_analyzer.py .

# Review recommendations
# Apply fixes
```

### 3. Implement Best Practices

Follow the patterns and practices documented in:
- `references/testing_strategies.md`
- `references/test_automation_patterns.md`
- `references/qa_best_practices.md`

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
python scripts/coverage_analyzer.py .
python scripts/e2e_test_scaffolder.py --analyze

# Deployment
docker build -t app:latest .
docker-compose up -d
kubectl apply -f k8s/
```

## Troubleshooting

### Common Issues

Check the comprehensive troubleshooting section in `references/qa_best_practices.md`.

### Getting Help

- Review reference documentation
- Check script output messages
- Consult tech stack documentation
- Review error logs

## Resources

- Pattern Reference: `references/testing_strategies.md`
- Workflow Guide: `references/test_automation_patterns.md`
- Technical Guide: `references/qa_best_practices.md`
- Tool Scripts: `scripts/` directory

---

## Huevos Point — Project Context

**Framework de tests:** Vitest (unitarios + integración) + Playwright o Cypress (E2E).
**Patrón:** AAA (Arrange, Act, Assert) en todos los tests.

### Pirámide de testing

```
E2E (Playwright/Cypress): Flujo completo scroll → productos → formulario → envío → confirmación
         ↑
Integración: useOrderSubmit con mock Supabase, hooks con servicios mockeados
         ↑
Unitarios: formatPrice, schemas Zod, Zustand store, utils
```

### Tests unitarios prioritarios

```typescript
// Lógica de negocio
formatPrice(4500, 'docena')         // → "$4.500 / docena"
formatPrice(10500, 'maple')         // → "$10.500 / maple"

// Zod schemas
orderPayloadSchema.parse(validData)  // → no lanza
orderPayloadSchema.parse(badPhone)   // → ZodError

// Zustand store
useAppStore.getState().addToOrder(product) // → items actualizado
useAppStore.getState().removeFromOrder(id) // → item eliminado
useAppStore.getState().clearOrder()        // → items vacío

// Validaciones de negocio
isValidArgentinePhone('+54 9 11 1234-5678') // → true
isValidArgentinePhone('12345')              // → false
```

### Tests de integración prioritarios

```typescript
// useOrderSubmit — mock del cliente Supabase
const mockSupabase = { from: vi.fn().mockReturnValue({ insert: vi.fn() }) }
// → submit con datos válidos → llama supabase.from('orders').insert()
// → submit con error de red → retorna error, no lanza excepción
// → submit duplicado → deshabilitado durante envío (loading state)

// useProducts — mock del servicio
// → carga productos desde fetchProducts()
// → filtra is_available=true
// → ordena por sort_order
```

### E2E — Flujo crítico de conversión

```
1. Carga de página → preloader animado aparece y desaparece
2. Hero section visible → scroll indicator presente
3. Scroll a Products → cards aparecen con animación
4. Tap/click en ProductCard → descripción se revela
5. Click "Agregar" → producto aparece en formulario
6. Completar formulario → validación onChange activa
7. Submit → estado "Enviando..." visible, botón deshabilitado
8. Éxito → animación de check + mensaje de confirmación
9. Error de red → toast de error + botón de retry
```

### Casos de borde a testear

- Formulario con teléfono argentino sin formato válido → error visible
- Producto `is_available: false` → sin CTA, imagen en grayscale
- Supabase devuelve array vacío → estado vacío con mensaje amigable
- `prefers-reduced-motion: reduce` → animaciones GSAP no bloquean la UX
- Viewport 320px → no hay scroll horizontal

### Métricas de coverage objetivo

| Capa | Coverage mínimo |
|------|-----------------|
| `lib/utils.ts` | 100% |
| `types/` (schemas Zod) | 100% |
| `stores/` | 90% |
| `services/` | 80% |
| `hooks/` | 70% |
| `components/` | E2E cubre flujo crítico |
