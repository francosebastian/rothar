# Arquitectura — Rothar

E-commerce de componentes para bicicletas.

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

## Estructura

```
rothar/
├── prisma/
│   ├── schema.prisma          # Modelos DB
│   ├── migrations/            # Migraciones SQL
│   └── seed.ts                # Seed data
├── src/
│   ├── app/                   # App Router
│   │   ├── (rutas públicas)   # blog, carrito, checkout, login, perfil, registro, tienda, videos
│   │   ├── admin/             # Panel admin (protegido rol ADMIN)
│   │   │   ├── layout.tsx     # Verifica sesión + rol, renderiza AdminNav
│   │   │   ├── AdminNav.tsx   # Navegación lateral
│   │   │   ├── productos/     # CRUD productos (server + client)
│   │   │   ├── pedidos/       # Lista + cambio estado
│   │   │   ├── blog/          # CRUD posts (React Quill)
│   │   │   └── usuarios/      # Lista usuarios
│   │   └── api/               # API routes
│   │       ├── auth/          # NextAuth, forgot/reset password
│   │       ├── products/      # GET público
│   │       ├── admin/products/# CRUD admin
│   │       ├── pedidos/       # POST crear + PUT status
│   │       ├── mercadopago/   # preference + payment
│   │       ├── addresses/     # CRUD direcciones (autenticado)
│   │       ├── registro/      # POST registrar usuario
│   │       └── youtube/       # GET videos
│   ├── components/            # UI compartidos
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── ProductCard.tsx
│   │   ├── AddToCartButton.tsx
│   │   ├── CartSummary.tsx
│   │   ├── ImageUpload.tsx    # UploadCare wrapper
│   │   └── ...
│   ├── lib/
│   │   ├── prisma.ts          # Cliente Prisma singleton (adapter Neon/pg según VERCEL)
│   │   ├── auth.ts            # NextAuth config + helpers
│   │   ├── store.ts           # Zustand carrito + toasts
│   │   ├── email.ts           # Resend (confirmación + reset + notificación admin)
│   │   └── youtube.ts         # YouTube API wrapper
│   └── generated/prisma/      # Prisma client generado
├── .env                       # DATABASE_URL local
├── .env.local                 # Variables sensibles (no commit)
├── docker-compose.yml         # PostgreSQL 16 + Adminer
└── next.config.ts             # Imágenes remotas, allowedDevOrigins
```

## Flujo de Compra

```
Usuario → /tienda (GET /api/products)
       → Agrega al carrito (Zustand → localStorage)
       → /checkout (formulario datos envío)
       → POST /api/mercadopago/preference (crea preferencia MP)
       → Redirige a MercadoPago Checkout Pro
       → POST /api/pedidos (crea Order + OrderItem, descuenta stock)
       → POST /api/mercadopago/payment (webhook, actualiza status PAID)
       → Emails: confirmación al cliente + notificación admin
```

## Arquitectura de Componentes

- **Server Components**: Páginas públicas (tienda, blog, producto individual), admin layouts, listas
- **Client Components**: Formularios, carrito (Zustand), botones interactivos, ImageUpload
- **Límite cliente/servidor**: Los forms usan `'use client'` y se comunican via `fetch` a API routes
- **Formulario producto**: `ProductForm.tsx` (cliente) → POST/PUT `/api/admin/products`

## Autenticación

- NextAuth v5 con JWT (sin base de datos para sesiones)
- CredentialsProvider: verifica email + password (bcryptjs)
- Callbacks JWT y Session para propagar `id` y `role`
- Admin layout verifica `session.user.role === 'ADMIN'`
- UI pública: Navbar condicional (login/logout/perfil)

## Base de Datos

### Modelos

```
User ──1:N── Order ──1:N── OrderItem ──N:1── Product
  │
  └──1:N── ShippingAddress

Post (independiente, blog)
```

### Prisma Adapter

- Producción (Vercel): `@prisma/adapter-neon`
- Local: `@prisma/adapter-pg`
- Singleton global para evitar múltiples conexiones en desarrollo

## Pagos (MercadoPago)

1. `POST /api/mercadopago/preference` — Crea preferencia, devuelve `init_point`
2. Cliente es redirigido a Checkout Pro de MP
3. `POST /api/mercadopago/payment` — Procesa pago (token card), actualiza Order a PAID
4. Idempotency key para evitar duplicados

## SEO

- Metadata dinámica por página (`generateMetadata`)
- JSON-LD (Product, BlogPosting)
- Open Graph tags
- Sitemap estático (`generateStaticParams` en productos y blog)

## Manejo de Estado (Cliente)

- **Carrito**: Zustand con persistencia en localStorage (`rothar-cart`)
- **Rehidratación**: `_hasHydrated` flag, conversión de tipos (precio/cantidad a Number)
- **Toasts**: Sistema interno de notificaciones (auto-dismiss 3s)
- **Carrito guest**: Funciona sin sesión, persiste entre sesiones
