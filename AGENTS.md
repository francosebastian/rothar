## Agente Minimalista

**Instrucciones:**
- Idioma: Español
- Respuesta: solo contenido técnico. Sin cortesías.
- Formato cambios: bloque diff/snippet, nunca archivo completo.
- Concisión: estilo telegrama. Sin artículos/nexos.
- Explicaciones: solo si hay error fatal.
- No resumir mensaje anterior.

## Proyecto

- Framework: Next.js 16 App Router + React 19
- DB: PostgreSQL + Prisma 7 (Neon/pg)
- Estilos: Tailwind CSS 4
- Auth: NextAuth v5 (JWT, Credentials)
- Pagos: MercadoPago SDK
- Estado cliente: Zustand 5 (localStorage)
- Email: Resend
- Uploads: UploadCare
- Editor: React Quill

## Convenciones

- API: `src/app/api/{recurso}/route.ts`
- Server Components default, `'use client'` solo cuando necesario
- Prisma client: `src/generated/prisma/`
- Schema DB: `prisma/schema.prisma`
- Precios: Decimal en DB, Number en JSON
- SKU opcional: vacío → `undefined`

## Enlaces

- [features.md](features.md) — Roadmap y features plan
- [specs.md](specs.md) — Especificaciones técnicas
- [architecture.md](architecture.md) — Arquitectura

## Skills

12 skills en `.opencode/skills/`. Usar según tarea:
- `next-best-practices` — Next.js, RSC, route handlers
- `seo` — Meta tags, structured data, sitemap
- `accessibility` — WCAG, a11y
- `tailwind-css-patterns` — Estilos
- `frontend-design` — UI/UX
- `typescript-advanced-types` — Tipos avanzados
- `nodejs-best-practices` / `nodejs-backend-patterns` — Backend
- `composition-patterns` / `react-best-practices` — Componentes
- `next-cache-components` — Cache, PPR
- `next-upgrade` — Migraciones

## Variables de Entorno

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL |
| `NEXTAUTH_SECRET` | JWT secret |
| `NEXTAUTH_URL` | Base URL auth |
| `MERCADO_PAGO_ACCESS_TOKEN` | Token MP |
| `NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY` | Public key MP |
| `NEXT_PUBLIC_BASE_URL` | URL pública |
| `RESEND_API_KEY` | API key Resend |
| `ADMIN_EMAIL` | Notificaciones pedidos |
| `NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY` | UploadCare |
| `UPLOADCARE_SECRET_KEY` | UploadCare API |
| `YOUTUBE_API_KEY` | YouTube Data API |

## Comandos

- Dev: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
- Typecheck: `npx tsc --noEmit`
- Prisma generate: `npx prisma generate`
- Prisma migrate: `npx prisma migrate dev`
- Prisma studio: `npx prisma studio`
- Docker DB: `docker compose up -d`
