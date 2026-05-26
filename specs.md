# Especificaciones — Rothar

## Funcionales

### Catálogo
- Listado público de productos con filtro por categoría y búsqueda
- Página individual de producto con SEO (JSON-LD, OpenGraph, metadata dinámica)
- Productos con: nombre, slug, precio, categoría, imagen, descripción, stock, SKU (opcional), activo/inactivo, destacado

### Carrito (Zustand + localStorage)
- Agregar/quitar productos
- Persistencia entre sesiones
- Actualización de cantidades

### Checkout
- Formulario con datos de envío
- Integración MercadoPago
- Creación de Order con items

### Admin
- CRUD productos (imagen via UploadCare)
- CRUD blog (React Quill)
- Gestión de pedidos (cambio de estado)
- Gestión de usuarios

### Autenticación
- Registro + login con email/contraseña
- NextAuth v5 con adaptador Prisma
- Roles: ADMIN / CLIENT
- Recuperación de contraseña (Resend)

## Técnicas

### API Routes (Next.js App Router)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/products` | Lista productos activos (filtro: category, search) |
| GET | `/api/products/[slug]` | Producto por slug |
| POST | `/api/admin/products` | Crear producto |
| PUT | `/api/admin/products/[id]` | Actualizar producto |
| DELETE | `/api/admin/products/[id]` | Eliminar producto |
| POST | `/api/pedidos` | Crear pedido |
| POST | `/api/mercadopago/webhook` | Webhook pagos |

### Modelos (Prisma)

- **Product**: id, name, slug (unique), price, category, image, description, stock, sku (opcional, unique), isActive, featured, createdAt, updatedAt
- **Order**: id, userId, customerName, customerEmail, customerPhone, shippingAddress, total, status, paymentId, createdAt
- **OrderItem**: id, orderId, productId, quantity, price
- **User**: id, email, name, passwordHash, role, phone, resetToken
- **Post**: id, title, slug, content, coverImage, isActive

### Responsive
- Tailwind CSS, diseño mobile-first
- Navegación adaptable

### Despliegue
- Vercel (build script configurado)
- PostgreSQL en Docker para desarrollo
