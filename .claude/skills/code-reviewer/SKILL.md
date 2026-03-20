---
name: code-reviewer
description: Comprehensive code review skill for TypeScript, JavaScript, Python, Swift, Kotlin, Go. Includes automated code analysis, best practice checking, security scanning, and review checklist generation. Use when reviewing pull requests, providing code feedback, identifying issues, or ensuring code quality standards.
---

# Code Reviewer

Complete toolkit for code reviewer with modern tools and best practices.

## Quick Start

### Main Capabilities

This skill provides three core capabilities through automated scripts:

```bash
# Script 1: Pr Analyzer
python scripts/pr_analyzer.py [options]

# Script 2: Code Quality Checker
python scripts/code_quality_checker.py [options]

# Script 3: Review Report Generator
python scripts/review_report_generator.py [options]
```

## Core Capabilities

### 1. Pr Analyzer

Automated tool for pr analyzer tasks.

**Features:**
- Automated scaffolding
- Best practices built-in
- Configurable templates
- Quality checks

**Usage:**
```bash
python scripts/pr_analyzer.py <project-path> [options]
```

### 2. Code Quality Checker

Comprehensive analysis and optimization tool.

**Features:**
- Deep analysis
- Performance metrics
- Recommendations
- Automated fixes

**Usage:**
```bash
python scripts/code_quality_checker.py <target-path> [--verbose]
```

### 3. Review Report Generator

Advanced tooling for specialized tasks.

**Features:**
- Expert-level automation
- Custom configurations
- Integration ready
- Production-grade output

**Usage:**
```bash
python scripts/review_report_generator.py [arguments] [options]
```

## Reference Documentation

### Code Review Checklist

Comprehensive guide available in `references/code_review_checklist.md`:

- Detailed patterns and practices
- Code examples
- Best practices
- Anti-patterns to avoid
- Real-world scenarios

### Coding Standards

Complete workflow documentation in `references/coding_standards.md`:

- Step-by-step processes
- Optimization strategies
- Tool integrations
- Performance tuning
- Troubleshooting guide

### Common Antipatterns

Technical reference guide in `references/common_antipatterns.md`:

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
python scripts/code_quality_checker.py .

# Review recommendations
# Apply fixes
```

### 3. Implement Best Practices

Follow the patterns and practices documented in:
- `references/code_review_checklist.md`
- `references/coding_standards.md`
- `references/common_antipatterns.md`

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
python scripts/code_quality_checker.py .
python scripts/review_report_generator.py --analyze

# Deployment
docker build -t app:latest .
docker-compose up -d
kubectl apply -f k8s/
```

## Troubleshooting

### Common Issues

Check the comprehensive troubleshooting section in `references/common_antipatterns.md`.

### Getting Help

- Review reference documentation
- Check script output messages
- Consult tech stack documentation
- Review error logs

## Resources

- Pattern Reference: `references/code_review_checklist.md`
- Workflow Guide: `references/coding_standards.md`
- Technical Guide: `references/common_antipatterns.md`
- Tool Scripts: `scripts/` directory

---

## Huevos Point — Project Context

**Stack de revisión:** React 18 + Vite + TypeScript strict · GSAP 3 · Supabase JS SDK · Tailwind CSS + Shadcn/UI · Zustand · React Hook Form + Zod

### Checklist de revisión específico del proyecto

**TypeScript**
- [ ] TypeScript strict, cero `any`. Interfaces explícitas para props y datos.
- [ ] Nombres descriptivos. Prohibido: `data`, `res2`, `temp`, `x`, `flag`.
- [ ] Variables/funciones: `camelCase` | Componentes: `PascalCase` | Constantes: `UPPER_SNAKE_CASE` | Hooks: `use`+PascalCase | DB: `snake_case`
- [ ] Max 3 parámetros por función; si más, usar objeto tipado.

**Arquitectura (antipatrones a rechazar)**
- [ ] Componentes NO llaman `supabase.from()` directamente → debe ir en `services/`
- [ ] Hooks NO importan `supabase.ts` directamente → reciben cliente como parámetro/contexto
- [ ] Estado compartido en Zustand, no prop drilling > 2 niveles
- [ ] Lógica en hooks, componentes solo renderizan

**GSAP**
- [ ] Todo timeline dentro de `useGSAP()` con `gsap.context()` (cleanup automático en unmount)
- [ ] Solo animar `transform` y `opacity`. NUNCA `width`, `height`, `top`, `left`, `margin`
- [ ] `will-change` solo durante animación activa, removido al completar
- [ ] DOM queries cacheadas: `gsap.utils.toArray()` una vez, nunca `querySelectorAll` en callbacks de scroll
- [ ] `ScrollTrigger.refresh()` solo tras cambios de layout, nunca en cada frame

**Seguridad**
- [ ] RLS activo en todas las tablas Supabase
- [ ] `VITE_SUPABASE_ANON_KEY` en frontend, `service_role_key` NUNCA en cliente
- [ ] No `dangerouslySetInnerHTML`
- [ ] Honeypot field en formularios
- [ ] Zod valida antes de tocar Supabase; CHECK constraints en DB

**Calidad**
- [ ] Sin magic numbers → constantes en `constants/animation.ts` o `constants/business.ts`
- [ ] Sin `catch(e) {}` vacío → clases de error personalizadas + toast de feedback
- [ ] `console.error('[ModuleName]', error)` con contexto. Sin `console.log` suelto
- [ ] Código comentado eliminado antes del commit
- [ ] Commits: `feat:` | `fix:` | `refactor:` | `perf:` | `style:` | `docs:` | `chore:`. PRs max 400 líneas.

**Formularios**
- [ ] React Hook Form + Zod, `mode: 'onChange'`
- [ ] Submit deshabilitado durante envío
- [ ] Labels con `htmlFor`, errores con `aria-describedby`
