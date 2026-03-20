---
name: senior-security
description: Comprehensive security engineering skill for application security, penetration testing, security architecture, and compliance auditing. Includes security assessment tools, threat modeling, crypto implementation, and security automation. Use when designing security architecture, conducting penetration tests, implementing cryptography, or performing security audits.
---

# Senior Security

Complete toolkit for senior security with modern tools and best practices.

## Quick Start

### Main Capabilities

This skill provides three core capabilities through automated scripts:

```bash
# Script 1: Threat Modeler
python scripts/threat_modeler.py [options]

# Script 2: Security Auditor
python scripts/security_auditor.py [options]

# Script 3: Pentest Automator
python scripts/pentest_automator.py [options]
```

## Core Capabilities

### 1. Threat Modeler

Automated tool for threat modeler tasks.

**Features:**
- Automated scaffolding
- Best practices built-in
- Configurable templates
- Quality checks

**Usage:**
```bash
python scripts/threat_modeler.py <project-path> [options]
```

### 2. Security Auditor

Comprehensive analysis and optimization tool.

**Features:**
- Deep analysis
- Performance metrics
- Recommendations
- Automated fixes

**Usage:**
```bash
python scripts/security_auditor.py <target-path> [--verbose]
```

### 3. Pentest Automator

Advanced tooling for specialized tasks.

**Features:**
- Expert-level automation
- Custom configurations
- Integration ready
- Production-grade output

**Usage:**
```bash
python scripts/pentest_automator.py [arguments] [options]
```

## Reference Documentation

### Security Architecture Patterns

Comprehensive guide available in `references/security_architecture_patterns.md`:

- Detailed patterns and practices
- Code examples
- Best practices
- Anti-patterns to avoid
- Real-world scenarios

### Penetration Testing Guide

Complete workflow documentation in `references/penetration_testing_guide.md`:

- Step-by-step processes
- Optimization strategies
- Tool integrations
- Performance tuning
- Troubleshooting guide

### Cryptography Implementation

Technical reference guide in `references/cryptography_implementation.md`:

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
python scripts/security_auditor.py .

# Review recommendations
# Apply fixes
```

### 3. Implement Best Practices

Follow the patterns and practices documented in:
- `references/security_architecture_patterns.md`
- `references/penetration_testing_guide.md`
- `references/cryptography_implementation.md`

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
python scripts/security_auditor.py .
python scripts/pentest_automator.py --analyze

# Deployment
docker build -t app:latest .
docker-compose up -d
kubectl apply -f k8s/
```

## Troubleshooting

### Common Issues

Check the comprehensive troubleshooting section in `references/cryptography_implementation.md`.

### Getting Help

- Review reference documentation
- Check script output messages
- Consult tech stack documentation
- Review error logs

## Resources

- Pattern Reference: `references/security_architecture_patterns.md`
- Workflow Guide: `references/penetration_testing_guide.md`
- Technical Guide: `references/cryptography_implementation.md`
- Tool Scripts: `scripts/` directory

---

## Huevos Point — Project Context

**Modelo de amenazas:** SPA pública + Supabase BaaS. Sin auth de usuarios. Superficie de ataque: formularios de pedido/contacto y lectura del catálogo.

### Controles de seguridad implementados

**Supabase RLS (Row Level Security)**
- `products`: SELECT público, sin INSERT/UPDATE/DELETE público. RLS habilitado.
- `orders`: solo INSERT público, sin SELECT público. Datos sensibles (teléfono, email) solo accesibles vía `service_role_key`.
- `contact_messages`: solo INSERT público, sin SELECT público.

**Credenciales**
- `VITE_SUPABASE_ANON_KEY` — Única key permitida en frontend (anon, controlada por RLS).
- `service_role_key` — NUNCA en código frontend, nunca en `.env.local` del cliente. Solo en Edge Functions (Supabase Dashboard env vars).
- `.env.local` en `.gitignore`. `.env.example` en repo sin valores reales.

**Validación doble**
- Capa 1: Zod en cliente antes de tocar Supabase (UX + primera línea de defensa)
- Capa 2: CHECK constraints en PostgreSQL (última línea de defensa)
- SDK Supabase genera prepared statements. Sin concatenación de strings en queries → sin SQL injection.

**XSS**
- React escapa por defecto. `dangerouslySetInnerHTML` PROHIBIDO.
- Sin `eval()`, sin `innerHTML` manual.

**Spam / Bots**
- Honeypot field en formularios (campo oculto que humanos no completan).
- Rate limiting: Supabase RLS o Cloudflare en producción.

**Headers de seguridad (Vercel/Netlify config)**
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

**CORS**
- Solo dominio de producción (`huevospoint.com.ar`) autorizado.
- Bloquear `/api/` en robots.txt si se implementa Express.

**HTTPS:** Obligatorio en producción. SSL via Vercel/Netlify automático.

**Accesibilidad de datos sensibles:** `customer_phone` y `customer_email` en `orders` solo accesibles vía Supabase Dashboard con `service_role_key`. El operador del negocio nunca expone estos datos públicamente.

### Vectores de riesgo específicos

| Vector | Riesgo | Mitigación |
|--------|--------|------------|
| Formulario de pedido | Spam masivo | Honeypot + rate limiting |
| Anon key expuesta | Abuso de inserciones | RLS policies + rate limiting |
| GSAP desde CDN | Supply chain | Self-hosted o verificado con SRI hash |
| Edge Function WhatsApp | Secretos en código | Supabase secrets management |
