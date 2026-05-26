# Arquitectura — Rothar

E-commerce de componentes para bicicletas.

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4 |
| Lenguaje | TypeScript 5 |
| DB | PostgreSQL 16 + Prisma 7 (ORM) |
| Auth | NextAuth v5 (Prisma adapter) |
| Pagos | MercadoPago SDK |
| Estado cliente | Zustand 5 (persist localStorage) |
| Email | Resend |
| Uploads | UploadCare |
| Editor | React Quill |

## Estructura

```
src/
├── app/              # App Router (pages + API)
│   ├── admin/        # Panel admin (CRUD productos, pedidos, blog, usuarios)
│   ├── api/          # API routes
│   │   ├── admin/products/   # CRUD productos (admin)
│   │   ├── products/         # GET público productos
│   │   ├── pedidos/          # Crear pedido
│   │   ├── auth/             # NextAuth
│   │   ├── mercadopago/      # Webhook pagos
│   │   └── ...
│   ├── tienda/       # Catálogo público
│   ├── carrito/      # Carrito (Zustand)
│   ├── checkout/     # Checkout + pago
│   └── ...
├── components/       # UI components compartidos
├── lib/              # Utilidades (auth, prisma, store, email, youtube)
└── generated/prisma/ # Prisma client generado
```

## Flujo principal

1. Catálogo público (`/tienda`) consulta `GET /api/products`
2. Usuario agrega al carrito (Zustand → localStorage)
3. Checkout: formulario → `POST /api/pedidos` → crea Order + OrderItem
4. Redirige a MercadoPago para pago
5. Webhook MercadoPago actualiza estado de Order
6. Emails de confirmación vía Resend

## Admin

- Panel protegido por rol ADMIN (NextAuth)
- CRUD productos, blog, gestión de pedidos y usuarios

## Base de datos

Modelos: User, Product, Order, OrderItem, Post, ShippingAddress.
Prisma schema en `prisma/schema.prisma`.
