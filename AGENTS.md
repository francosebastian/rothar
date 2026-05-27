## Agente Minimalista (Ahorro de Tokens)

**Instrucciones de Comportamiento:**
- **Idioma:** Español.
- **Respuesta:** Solo contenido técnico. Prohibido "¡Hola!", "Entiendo", "Aquí tienes" o cualquier frase de cortesía.
- **Formato:** Si modificas código, entrega únicamente el bloque cambiado (formato diff o snippet), nunca el archivo completo.
- **Concisión:** Usa estilo telegrama. Elimina artículos, adjetivos y nexos innecesarios.
- **Explicaciones:** Solo si se solicita explícitamente o si hay un error fatal de lógica. Máximo 10 palabras por párrafo.
- **Tokens de Entrada:** No resumas mi mensaje anterior. Asume el contexto sin repetirlo.

## Proyecto

- Framework: Next.js 16 App Router + React 19
- DB: PostgreSQL + Prisma 7 (adapters Neon/pg según entorno)
- Estilos: Tailwind CSS 4
- Auth: NextAuth v5 (JWT, solo Credentials provider)
- Pagos: MercadoPago SDK
- Estado cliente: Zustand 5 (persist localStorage)
- Email: Resend
- Uploads: UploadCare
- Editor: React Quill (blog admin)

## Convenciones

- API routes: `src/app/api/{recurso}/route.ts`
- Server Components por defecto, `'use client'` solo cuando es necesario
- Prisma client en `src/generated/prisma/` (generado)
- Schema DB: `prisma/schema.prisma`
- Precios: Decimal en DB, Number en JSON (serialización manual)
- SKU opcional: `String? @unique`, vacío → `undefined` en create/update

## Variables de Entorno Clave

| Variable | Descripción |
|----------|------------|
| `DATABASE_URL` | PostgreSQL (local o Neon) |
| `NEXTAUTH_SECRET` | Secreto JWT |
| `NEXTAUTH_URL` | URL base auth |
| `MERCADO_PAGO_ACCESS_TOKEN` | Token MercadoPago |
| `NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY` | Public key MP |
| `NEXT_PUBLIC_BASE_URL` | URL pública |
| `RESEND_API_KEY` | API key Resend |
| `NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY` | UploadCare key |
| `YOUTUBE_API_KEY` | API key YouTube |

## Comandos

- Dev: `npm run dev`
- Build: `npm run build`
- Prisma generate: `npx prisma generate`
- Prisma migrate: `npx prisma migrate dev`
- Prisma studio: `npx prisma studio`
- Docker DB: `docker compose up -d`
- Lint: `npm run lint`
- Typecheck: `npx tsc --noEmit`
