# Especificaciones — Rothar

## Funcionales

### Catálogo Público (`/tienda`)
- Listado de productos activos con filtro por categoría (URL search params)
- Búsqueda por nombre/descripción (insensitive)
- Página individual por slug con SEO completo
- Imagen, precio, stock, SKU (opcional), descripción
- Botón "Agregar al carrito"

### Carrito
- Persistente entre sesiones (localStorage via Zustand)
- Agregar, quitar, actualizar cantidad
- Contador en Navbar
- Toast de confirmación al agregar
- Página `/carrito` con resumen

### Checkout (`/checkout`)
- Formulario de datos de envío (nombre, email, teléfono, dirección)
- Integración MercadoPago (Checkout Pro o tarjeta)
- Creación de pedido en DB
- Confirmación por email al cliente
- Notificación por email al admin

### Admin (`/admin`)
- Panel protegido: sesión + rol ADMIN
- Navegación lateral con secciones

#### Productos
- CRUD completo (crear, listar, editar, eliminar)
- Campos: nombre, slug, precio, categoría, imagen (UploadCare), descripción, stock, SKU (opcional), activo/inactivo
- Toggle activo/inactivo inline
- SKU único pero opcional

#### Pedidos
- Lista completa con: ID, cliente, productos (modal), total, estado, fecha
- Cambio de estado: PENDING → PAID → SHIPPED → DELIVERED / CANCELLED
- Filtro visual por estado (colores)

#### Blog
- CRUD con editor rich text (React Quill)
- Cover image opcional
- Toggle activo/inactivo

#### Usuarios
- Lista con: nombre, email, rol, teléfono, cantidad de pedidos, fecha de registro

### Autenticación
- Registro con nombre, email, contraseña, teléfono opcional, dirección opcional
- Login con email + contraseña
- Recuperación de contraseña (token por email, expira 1 hora)
- Roles: ADMIN / CLIENT

### Blog (`/blog`)
- Lista de posts activos
- Página individual por slug
- Cover image, contenido rich text

### YouTube (`/videos`)
- Grid de últimos videos del canal (vía API)

## API Routes

### Públicas

| Método | Ruta | Auth | Body/Params | Respuesta |
|--------|------|------|-------------|-----------|
| GET | `/api/products` | No | `?category=&search=` | `Product[]` (price serializado) |
| GET | `/api/youtube/videos` | No | `?channelId=&maxResults=` | `{ videos: [] }` |

### Autenticación

| Método | Ruta | Auth | Body | Respuesta |
|--------|------|------|------|-----------|
| POST | `/api/auth/[...nextauth]` | No | credentials | Sesión JWT |
| POST | `/api/registro` | No | `{ name, email, password, phone?, street?, city?, state?, zipCode? }` | 201 |
| POST | `/api/auth/forgot-password` | No | `{ email }` | Email con token |
| POST | `/api/auth/reset-password` | No | `{ token, password }` | OK |

### Admin (requiere sesión + rol ADMIN)

| Método | Ruta | Body | Descripción |
|--------|------|------|-------------|
| POST | `/api/admin/products` | `{ name, slug, price, category, image, description, stock, sku?, isActive? }` | Crear |
| PUT | `/api/admin/products/[id]` | Partial de arriba | Actualizar |
| DELETE | `/api/admin/products/[id]` | - | Eliminar |
| POST | `/api/admin/blog` | `{ title, slug, content, coverImage?, isActive? }` | Crear post |
| PUT | `/api/admin/blog/[id]` | Partial de arriba | Actualizar |
| DELETE | `/api/admin/blog/[id]` | - | Eliminar |

### Checkout / Pagos

| Método | Ruta | Auth | Body | Descripción |
|--------|------|------|------|-------------|
| POST | `/api/pedidos` | No | `{ customerName, customerEmail, customerPhone?, shippingAddress, items, total }` | Crear pedido + descontar stock + emails |
| PUT | `/api/pedidos/[orderId]/status` | Sesión | `{ status }` | Cambiar estado (dueño o admin) |
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

### Product
| Campo | Tipo | Restricciones |
|-------|------|---------------|
| id | String | PK, @default(cuid()) |
| name | String | requerido |
| slug | String | @unique, requerido |
| price | Decimal | requerido |
| category | String | requerido |
| image | String | requerido |
| description | String | requerido |
| stock | Int | @default(0) |
| sku | String? | @unique, opcional |
| isActive | Boolean | @default(true) |
| featured | Boolean | @default(false) |
| createdAt | DateTime | @default(now()) |
| updatedAt | DateTime | @updatedAt |

### Order
| Campo | Tipo | Restricciones |
|-------|------|---------------|
| id | String | PK, @default(cuid()) |
| userId | String? | FK → User (opcional) |
| customerName | String | requerido |
| customerEmail | String | requerido |
| customerPhone | String | |
| shippingAddress | Json | |
| total | Decimal | |
| status | String | @default("PENDING") |
| paymentId | String? | ID de MP |
| createdAt | DateTime | @default(now()) |

### OrderItem
| Campo | Tipo | Restricciones |
|-------|------|---------------|
| id | String | PK |
| orderId | String | FK → Order (Cascade) |
| productId | String | FK → Product |
| quantity | Int | |
| price | Decimal | precio al momento de compra |

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
| content | String | HTML (React Quill) |
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
| `NEXT_PUBLIC_BASE_URL` | Sí | URLs absolutas (emails, redirects) |
| `RESEND_API_KEY` | Sí | Email service |
| `RESEND_FROM_EMAIL` | No | Default: onboarding@resend.dev |
| `ADMIN_EMAIL` | Sí | Notificaciones de pedidos |
| `NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY` | Sí | Upload imágenes |
| `UPLOADCARE_SECRET_KEY` | Sí | UploadCare API |
| `YOUTUBE_API_KEY` | Sí | YouTube Data API |

## Reglas de Negocio

- Producto sin stock no se puede agregar al carrito (validación server-side al crear pedido)
- SKU opcional: string vacío se guarda como `null` en DB
- Pedido sin usuario autenticado se crea igual (guest checkout)
- Email de confirmación no bloquea creación del pedido (try/catch)
- Solo ADMIN puede acceder a `/admin/*`
- Usuario puede ver/cambiar estado de sus propios pedidos

## Responsive

- Tailwind CSS, diseño mobile-first
- Navbar con menú hamburguesa en mobile
- Grid de productos: 1 col (mobile) → 2 (tablet) → 3-4 (desktop)
- Admin layout: sidebar lateral en desktop

## Despliegue

- Vercel, build script: `prisma generate && prisma migrate deploy && prisma db seed && next build`
- Desarrollo local con Docker Compose (PostgreSQL 16 + Adminer en :8080)
- Base de datos PostgreSQL en Neon (producción)
