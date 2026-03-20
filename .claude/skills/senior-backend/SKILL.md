---
name: senior-backend
description: Comprehensive backend development skill for building scalable backend systems using NodeJS, Express, Go, Python, Postgres, GraphQL, REST APIs. Includes API scaffolding, database optimization, security implementation, and performance tuning. Use when designing APIs, optimizing database queries, implementing business logic, handling authentication/authorization, or reviewing backend code.
---

# Senior Backend

Complete toolkit for senior backend with modern tools and best practices.

## Quick Start

### Main Capabilities

This skill provides three core capabilities through automated scripts:

```bash
# Script 1: Api Scaffolder
python scripts/api_scaffolder.py [options]

# Script 2: Database Migration Tool
python scripts/database_migration_tool.py [options]

# Script 3: Api Load Tester
python scripts/api_load_tester.py [options]
```

## Core Capabilities

### 1. Api Scaffolder

Automated tool for api scaffolder tasks.

**Features:**
- Automated scaffolding
- Best practices built-in
- Configurable templates
- Quality checks

**Usage:**
```bash
python scripts/api_scaffolder.py <project-path> [options]
```

### 2. Database Migration Tool

Comprehensive analysis and optimization tool.

**Features:**
- Deep analysis
- Performance metrics
- Recommendations
- Automated fixes

**Usage:**
```bash
python scripts/database_migration_tool.py <target-path> [--verbose]
```

### 3. Api Load Tester

Advanced tooling for specialized tasks.

**Features:**
- Expert-level automation
- Custom configurations
- Integration ready
- Production-grade output

**Usage:**
```bash
python scripts/api_load_tester.py [arguments] [options]
```

## Reference Documentation

### Api Design Patterns

Comprehensive guide available in `references/api_design_patterns.md`:

- Detailed patterns and practices
- Code examples
- Best practices
- Anti-patterns to avoid
- Real-world scenarios

### Database Optimization Guide

Complete workflow documentation in `references/database_optimization_guide.md`:

- Step-by-step processes
- Optimization strategies
- Tool integrations
- Performance tuning
- Troubleshooting guide

### Backend Security Practices

Technical reference guide in `references/backend_security_practices.md`:

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
python scripts/database_migration_tool.py .

# Review recommendations
# Apply fixes
```

### 3. Implement Best Practices

Follow the patterns and practices documented in:
- `references/api_design_patterns.md`
- `references/database_optimization_guide.md`
- `references/backend_security_practices.md`

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
python scripts/database_migration_tool.py .
python scripts/api_load_tester.py --analyze

# Deployment
docker build -t app:latest .
docker-compose up -d
kubectl apply -f k8s/
```

## Troubleshooting

### Common Issues

Check the comprehensive troubleshooting section in `references/backend_security_practices.md`.

### Getting Help

- Review reference documentation
- Check script output messages
- Consult tech stack documentation
- Review error logs

## Resources

- Pattern Reference: `references/api_design_patterns.md`
- Workflow Guide: `references/database_optimization_guide.md`
- Technical Guide: `references/backend_security_practices.md`
- Tool Scripts: `scripts/` directory

---

## Huevos Point — Project Context

**Backend:** Supabase es el backend primario. Express.js solo si se necesita proxy CORS, SSR parcial o rate limiting avanzado.

### Tablas PostgreSQL (Supabase)

```sql
-- products: catálogo de huevos
id UUID PK · name TEXT · slug TEXT UNIQUE · description TEXT · long_desc TEXT
price NUMERIC(10,2) · unit TEXT ('unidad'|'media_docena'|'docena'|'maple')
category TEXT · image_url TEXT · image_alt TEXT · is_featured BOOL · is_available BOOL
sort_order INT · nutrition JSONB · origin TEXT · created_at TIMESTAMPTZ · updated_at TIMESTAMPTZ

-- orders: pedidos de clientes
id UUID PK · customer_name TEXT · customer_phone TEXT · customer_email TEXT
items JSONB [{product_id, quantity, unit}] · notes TEXT · delivery_zone TEXT
status TEXT ('pending'|'confirmed'|'delivered'|'cancelled') · total_estimate NUMERIC(10,2)

-- contact_messages: mensajes genéricos
id UUID PK · name TEXT · email TEXT · message TEXT · read BOOL · created_at TIMESTAMPTZ
```

### RLS Policies obligatorias

```sql
-- products: solo lectura pública
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);

-- orders: solo inserción pública
CREATE POLICY "Anyone can insert orders" ON orders FOR INSERT WITH CHECK (true);

-- contact_messages: solo inserción pública
CREATE POLICY "Anyone can insert messages" ON contact_messages FOR INSERT WITH CHECK (true);
```

### Servicios (Repository Pattern)

Toda interacción con Supabase va en `src/services/`:
- `services/products.ts` — `fetchProducts()`, `fetchFeaturedProducts()`, `fetchProductBySlug()`
- `services/orders.ts` — `submitOrder(payload: OrderPayload)`
- `services/contact.ts` — `submitContactMessage(payload)`

Hooks consumen servicios, NO la DB directamente.

### Edge Functions

- `notify-order` — se dispara vía DB webhook al insertar en `orders` → notifica vía WhatsApp Business API.
- Runtime: Deno. Variables de entorno en Supabase Dashboard (no en `.env.local`).

### Variables de entorno

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co   # Solo en cliente con VITE_ prefix
VITE_SUPABASE_ANON_KEY=eyJ...                 # Solo anon key en cliente
VITE_WHATSAPP_NUMBER=5491112345678
# service_role_key NUNCA en frontend, solo en Edge Functions
```

### Validación

- **Zod** valida en cliente antes de tocar Supabase.
- **CHECK constraints** como última línea de defensa en PostgreSQL.
- Verificar `error` en toda respuesta de Supabase antes de asumir éxito.
- SDK de Supabase genera prepared statements. Sin concatenación de strings en queries.

### Migraciones

Versionadas en `supabase/migrations/`. Nunca modificar producción manualmente.
