# Arquitectura — Rothar

E-commerce componentes para bicicletas + taller.

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
│   │   ├── (rutas públicas)   # blog, carrito, checkout, faqs, login, perfil, registro, servicios, tienda, videos
│   │   ├── admin/             # Panel admin (rol ADMIN)
│   │   │   ├── layout.tsx     # Verifica sesión + rol
│   │   │   ├── AdminNav.tsx   # Navegación lateral
│   │   │   ├── productos/     # CRUD productos (modal)
│   │   │   ├── categorias/    # CRUD categorías
│   │   │   ├── pedidos/       # Lista + cambio estado
│   │   │   ├── blog/          # CRUD posts (React Quill)
│   │   │   ├── faqs/          # CRUD preguntas frecuentes
│   │   │   └── usuarios/      # Lista usuarios
│   │   └── api/               # API routes
│   │       ├── auth/          # NextAuth, forgot/reset password
│   │       ├── products/      # GET público (filtro categoría + búsqueda)
│   │       ├── categories/    # GET público
│   │       ├── faqs/          # GET público (activas, ordenadas)
│   │       ├── pedidos/       # POST crear + PUT status
│   │       ├── mercadopago/   # preference + payment
│   │       ├── addresses/     # CRUD direcciones (autenticado)
│   │       ├── registro/      # POST registrar usuario
│   │       ├── youtube/       # GET videos
│   │       └── admin/         # CRUD admin (products, categories, faqs, blog)
│   ├── components/            # UI compartidos
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── ProductCard.tsx
│   │   ├── AddToCartButton.tsx
│   │   ├── CartSummary.tsx
│   │   ├── ImageUpload.tsx    # UploadCare wrapper
│   │   ├── Contact.tsx        # WhatsApp, email, mapa
│   │   ├── Hero.tsx
│   │   ├── Services.tsx
│   │   ├── BlogPreview.tsx
│   │   ├── ProductsPreview.tsx
│   │   ├── VideosPreview.tsx
│   │   ├── VideoGrid.tsx
│   │   └── ToggleButton.tsx
│   ├── lib/
│   │   ├── prisma.ts          # Cliente Prisma singleton (Neon/pg)
│   │   ├── auth.ts            # NextAuth config + helpers
│   │   ├── store.ts           # Zustand carrito + toasts
│   │   ├── email.ts           # Resend
│   │   └── youtube.ts         # YouTube API wrapper
│   └── generated/prisma/      # Prisma client generado
├── .env                       # DATABASE_URL local
├── .env.local                 # Variables sensibles
├── docker-compose.yml         # PostgreSQL 16 + Adminer
└── next.config.ts             # Imágenes remotas
```

## Flujo de Compra

```
Usuario → /tienda (GET /api/products)
       → Agrega carrito (Zustand → localStorage)
       → /checkout (formulario envío)
       → POST /api/mercadopago/preference
       → MercadoPago Checkout Pro
       → POST /api/pedidos (Order + OrderItem, descuenta stock)
       → POST /api/mercadopago/payment (webhook, status PAID)
       → Emails: confirmación cliente + notificación admin
```

## Componentes

- **Server Components**: Páginas públicas, admin layouts, listas
- **Client Components**: Formularios, carrito, botones, ImageUpload
- **Comunicación**: Client → `fetch` → API routes

## Autenticación

- NextAuth v5 JWT (sin DB para sesiones)
- CredentialsProvider: email + password (bcryptjs)
- Callbacks JWT/Session propagan `id` y `role`
- Admin layout verifica `role === 'ADMIN'`
- Login redirige admin a `/admin`, client a `/`

## Base de Datos

### Modelos

```
User ──1:N── Order ──1:N── OrderItem ──N:1── Product
  │                                          │
  └──1:N── ShippingAddress                   └──N:1── Category

Post (independiente, blog)
Faq (independiente, faqs)
```

### Prisma Adapter

- Producción (Vercel): `@prisma/adapter-neon`
- Local: `@prisma/adapter-pg`
- Singleton global (evita múltiples conexiones en dev)

## Pagos (MercadoPago)

1. `POST /api/mercadopago/preference` — Crea preferencia, devuelve `init_point`
2. Cliente redirigido a Checkout Pro
3. `POST /api/mercadopago/payment` — Procesa pago, actualiza Order a PAID
4. Idempotency key evita duplicados

## SEO

- Metadata dinámica por página (`generateMetadata`)
- JSON-LD (Product, BlogPosting)
- Open Graph tags
- Sitemap dinámico (productos y blog)

## Estado Cliente

- **Carrito**: Zustand + localStorage (`rothar-cart`)
- **Rehidratación**: `_hasHydrated` flag, conversión tipos
- **Toasts**: auto-dismiss 3s
- **Guest**: funciona sin sesión
