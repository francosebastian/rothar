# Especificaciones — Rothar

## Funcionales

### Catálogo Público (`/tienda`)
- Listado productos activos con filtro por categoría (slug vía search params)
- Búsqueda por nombre/descripción (case-insensitive)
- Página individual por slug con SEO completo
- Imagen, precio, stock, SKU (opcional), descripción
- Botón "Agregar al carrito"

### Carrito
- Persistente (localStorage via Zustand)
- Agregar, quitar, actualizar cantidad
- Contador en Navbar
- Toast confirmación al agregar
- Página `/carrito` con resumen

### Checkout (`/checkout`)
- Formulario datos envío (nombre, email, teléfono, dirección)
- Integración MercadoPago (Checkout Pro)
- Creación pedido en DB
- Email confirmación al cliente + notificación admin

### Admin (`/admin`)
- Panel protegido: sesión + rol ADMIN
- Navegación lateral con secciones
- CRUD productos (modal con categorías desde API)
- CRUD categorías (modal, con validación slug único)
- CRUD FAQs (modal, orden, toggle activo)
- CRUD blog (React Quill)
- Lista pedidos + cambio estado (PENDING→PAID→SHIPPED→DELIVERED/CANCELLED)
- Lista usuarios

### Autenticación
- Registro: nombre, email, contraseña, teléfono opcional, dirección opcional
- Login: email + contraseña
- Recuperación contraseña (token por email, expira 1h)
- Roles: ADMIN / CLIENT
- Guest checkout permitido

### Blog (`/blog`)
- Lista posts activos
- Página individual por slug
- Cover image opcional, contenido rich text

### FAQ (`/faqs`)
- Acordeón (click expande respuesta)
- FAQs activas ordenadas por campo `order`
- Accesible desde footer

### YouTube (`/videos`)
- Grid últimos videos del canal vía YouTube Data API

### Contacto
- WhatsApp: link `wa.me/56959511421`
- Email: `contacto@rotharworshop.cl`
- Dirección: Google Maps embed
- Horario: Lun-Vie 10-19, Sáb 10-14

## API Routes

### Públicas

| Método | Ruta | Auth | Params | Respuesta |
|--------|------|------|--------|-----------|
| GET | `/api/products` | No | `?category=&search=&featured=` | `Product[]` (price serializado) |
| GET | `/api/categories` | No | - | `Category[]` |
| GET | `/api/faqs` | No | - | `Faq[]` (activas, por order) |
| GET | `/api/youtube/videos` | No | `?channelId=&maxResults=` | `{ videos: [] }` |

### Autenticación

| Método | Ruta | Auth | Body | Respuesta |
|--------|------|------|------|-----------|
| POST | `/api/auth/[...nextauth]` | No | credentials | Sesión JWT |
| POST | `/api/registro` | No | `{ name, email, password, phone?, street?, city?, state?, zipCode? }` | 201 |
| POST | `/api/auth/forgot-password` | No | `{ email }` | Email con token |
| POST | `/api/auth/reset-password` | No | `{ token, password }` | OK |

### Admin (requiere sesión ADMIN)

| Método | Ruta | Body |
|--------|------|------|
| POST | `/api/admin/products` | `{ name, slug, price, categoryId, image, description, stock, sku?, isActive?, featured? }` |
| PUT | `/api/admin/products/[id]` | Partial de arriba |
| DELETE | `/api/admin/products/[id]` | - |
| POST | `/api/admin/categories` | `{ name, slug }` |
| PUT | `/api/admin/categories/[id]` | `{ name?, slug? }` |
| DELETE | `/api/admin/categories/[id]` | - (bloqueado si tiene productos) |
| POST | `/api/admin/faqs` | `{ question, answer, order?, isActive? }` |
| GET | `/api/admin/faqs` | - |
| PUT | `/api/admin/faqs/[id]` | `{ question?, answer?, order?, isActive? }` |
| DELETE | `/api/admin/faqs/[id]` | - |
| POST | `/api/admin/blog` | `{ title, slug, content, coverImage?, isActive? }` |
| PUT | `/api/admin/blog/[id]` | Partial de arriba |
| DELETE | `/api/admin/blog/[id]` | - |

### Checkout / Pagos

| Método | Ruta | Auth | Body | Descripción |
|--------|------|------|------|-------------|
| POST | `/api/pedidos` | No | `{ customerName, customerEmail, customerPhone?, shippingAddress, items, total }` | Crear pedido + descontar stock + emails |
| PUT | `/api/pedidos/[orderId]/status` | Sesión | `{ status }` | Cambiar estado |
| POST | `/api/mercadopago/preference` | No | `{ items, total, datos_cliente }` | Crear preferencia MP |
| POST | `/api/mercadopago/payment` | No | `{ token, payment_method_id, transaction_amount, payer, external_reference }` | Procesar pago |

### Direcciones (requiere sesión)

| Método | Ruta | Body |
|--------|------|------|
| GET | `/api/addresses` | - |
| POST | `/api/addresses` | `{ street, city, state?, zipCode? }` |
| PATCH | `/api/addresses/[id]` | Partial update |
| DELETE | `/api/addresses/[id]` | - |

## Modelos (Prisma)

### Category
| Campo | Tipo | Restricciones |
|-------|------|---------------|
| id | String | PK, @default(cuid()) |
| name | String | @unique |
| slug | String | @unique |
| createdAt | DateTime | @default(now()) |
| updatedAt | DateTime | @updatedAt |

### Product
| Campo | Tipo | Restricciones |
|-------|------|---------------|
| id | String | PK, @default(cuid()) |
| name | String | requerido |
| slug | String | @unique |
| price | Decimal | |
| categoryId | String | FK → Category |
| image | String | |
| description | String | |
| stock | Int | @default(0) |
| sku | String? | @unique |
| isActive | Boolean | @default(true) |
| featured | Boolean | @default(false) |
| createdAt | DateTime | @default(now()) |
| updatedAt | DateTime | @updatedAt |

### Faq
| Campo | Tipo | Restricciones |
|-------|------|---------------|
| id | String | PK, @default(cuid()) |
| question | String | |
| answer | String | |
| order | Int | @default(0) |
| isActive | Boolean | @default(true) |
| createdAt | DateTime | @default(now()) |
| updatedAt | DateTime | @updatedAt |

### Order
| Campo | Tipo | Restricciones |
|-------|------|---------------|
| id | String | PK |
| userId | String? | FK → User |
| customerName | String | |
| customerEmail | String | |
| customerPhone | String | |
| shippingAddress | Json | |
| total | Decimal | |
| status | String | @default("PENDING") |
| paymentId | String? | ID MP |
| createdAt | DateTime | @default(now()) |

### OrderItem
| Campo | Tipo | Restricciones |
|-------|------|---------------|
| id | String | PK |
| orderId | String | FK → Order (Cascade) |
| productId | String | FK → Product |
| quantity | Int | |
| price | Decimal | |

### User
| Campo | Tipo | Restricciones |
|-------|------|---------------|
| id | String | PK |
| email | String | @unique |
| name | String | |
| passwordHash | String | bcryptjs |
| role | UserRole | CLIENT \| ADMIN |
| phone | String? | |
| resetToken | String? | @unique |
| resetTokenExpires | DateTime? | |

### Post
| Campo | Tipo | Restricciones |
|-------|------|---------------|
| id | String | PK |
| title | String | |
| slug | String | @unique |
| content | String | HTML |
| coverImage | String? | |
| isActive | Boolean | @default(true) |
| createdAt | DateTime | |
| updatedAt | DateTime | |

### ShippingAddress
| Campo | Tipo | Restricciones |
|-------|------|---------------|
| id | String | PK |
| userId | String | FK → User (Cascade) |
| street | String | |
| city | String | |
| state | String? | |
| zipCode | String | |
| isDefault | Boolean | @default(false) |

## Variables de Entorno

| Variable | Requerida | Uso |
|----------|-----------|-----|
| `DATABASE_URL` | Sí | Conexión PostgreSQL |
| `NEXTAUTH_SECRET` | Sí | JWT signing |
| `NEXTAUTH_URL` | Sí | URL base auth |
| `MERCADO_PAGO_ACCESS_TOKEN` | Sí | API MercadoPago |
| `NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY` | Sí | Frontend MP |
| `NEXT_PUBLIC_BASE_URL` | Sí | URLs absolutas |
| `RESEND_API_KEY` | Sí | Email service |
| `RESEND_FROM_EMAIL` | No | Default: onboarding@resend.dev |
| `ADMIN_EMAIL` | Sí | Notificaciones pedidos |
| `NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY` | Sí | Upload imágenes |
| `UPLOADCARE_SECRET_KEY` | Sí | UploadCare API |
| `YOUTUBE_API_KEY` | Sí | YouTube Data API |

## Reglas de Negocio

- Producto sin stock no se agrega al carrito (validación server-side)
- SKU opcional: string vacío → `null` en DB
- Guest checkout permitido (pedido sin userId)
- Email de confirmación no bloquea creación del pedido (try/catch)
- Solo ADMIN puede acceder a `/admin/*`
- Usuario puede ver/cambiar estado de sus propios pedidos
- Categoría con productos no se puede eliminar

## Responsive

- Tailwind CSS, mobile-first
- Navbar hamburguesa en mobile
- Grid productos: 1 col → 2 (tablet) → 3-4 (desktop)
- Admin: sidebar lateral en desktop

## Despliegue

- Vercel, build: `prisma generate && prisma migrate deploy && prisma db seed && next build`
- DB: Neon (producción), Docker Compose (local)
