# Rothar Workshop

E-commerce de componentes y taller de bicicletas. Venta de grupos microSHIFT, accesorios y servicios de mantenimiento.

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 16.2 (App Router) |
| UI | React 19.2, Tailwind CSS 4 |
| Lenguaje | TypeScript 5 |
| DB | PostgreSQL 16 + Prisma 7 (ORM) |
| Auth | NextAuth v5 (JWT, Credentials) |
| Pagos | MercadoPago API |
| Estado cliente | Zustand 5 (persist localStorage) |
| Email | Resend |
| Uploads | UploadCare |
| Editor | React Quill |
| Despliegue | Vercel |

## Comenzar

```bash
npm install
docker compose up -d    # PostgreSQL 16 + Adminer (:8080)
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Variables de entorno en `.env.local` (ver `.env` para referencia).

## Documentación

- [Arquitectura](architecture.md)
- [Especificaciones](specs.md)
- [Features (roadmap)](features.md)
- [Comandos y convenciones](AGENTS.md)

## Estructura

```
src/
├── app/          # App Router (páginas + API routes)
├── components/   # UI compartidos (Navbar, Footer, cards, etc.)
├── lib/          # Prisma, auth, email, store, youtube
├── data/         # Datos estáticos
└── generated/    # Prisma client generado
prisma/
├── schema.prisma # Modelos DB
├── migrations/   # Migraciones SQL
└── seed.ts       # Seed data
```

## Comandos

| Comando | Descripción |
|---------|------------|
| `npm run dev` | Dev server |
| `npm run build` | Build producción |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Typecheck |
| `npx prisma studio` | DB visual |
| `npx prisma migrate dev` | Migración |

## Skills Instaladas

12 skills en `.opencode/skills/`: next-best-practices, seo, accessibility, tailwind-css-patterns, frontend-design, typescript-advanced-types, nodejs-best-practices, nodejs-backend-patterns, composition-patterns, react-best-practices, next-cache-components, next-upgrade.
