# Features Plan

## 1. Categorías Dinámicas

### Modelo
- Nuevo modelo `Category` en Prisma: id, name (unique), slug (unique), createdAt, updatedAt
- Producto cambia de `category String` a `categoryId String` + FK → Category

### Admin
- Nueva sección "Categorías" en el panel admin
- Lista de categorías con modal para crear/editar
- Botón eliminar con confirmación
- Al crear/editar producto, dropdown carga categorías desde DB

### Tienda Pública
- Filtro de categorías se carga desde `GET /api/categories`
- Productos se filtran por `categoryId`

### API
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/categories` | Lista pública de categorías activas |
| POST | `/api/admin/categories` | Crear categoría |
| PUT | `/api/admin/categories/[id]` | Editar categoría |
| DELETE | `/api/admin/categories/[id]` | Eliminar categoría |

### Archivos a crear/modificar
- `prisma/schema.prisma` — agregar Category, modificar Product
- `src/app/api/categories/route.ts` — GET público
- `src/app/api/admin/categories/route.ts` — POST
- `src/app/api/admin/categories/[id]/route.ts` — PUT, DELETE
- `src/app/admin/categorias/page.tsx` — página admin
- `src/app/admin/categorias/CategoryForm.tsx` — modal form
- `src/app/admin/categorias/CategoryList.tsx` — list component
- `src/app/admin/productos/ProductForm.tsx` — cargar categorías desde API
- `src/app/tienda/page.tsx` — cargar categorías desde API
- `src/app/api/products/route.ts` — filtrar por categoryId

---

## 2. Admin Login Redirect

### Cambio
- En `login/page.tsx`, después de `signIn` exitoso:
  - Obtener sesión actual
  - Si `session.user.role === 'ADMIN'`, redirigir a `/admin`
  - Si no, redirigir a `/` (comportamiento actual)

### Archivos a modificar
- `src/app/login/page.tsx` — verificar rol y redirigir

---

## 3. Product CRUD en Modal (Admin)

### Cambio
- El formulario de producto se abre en una ventana modal overlay
- En lugar de toggle show/hide inline, se usa un modal centrado
- Modal se abre al hacer clic en "Agregar Producto" o "Editar"
- Modal tiene botón cerrar (X) y backdrop click para cerrar

### Archivos a modificar
- `src/app/admin/productos/page.tsx` — reemplazar ToggleButton por modal trigger
- `src/app/admin/productos/ProductForm.tsx` — adaptar para modo modal (recibir onClose)
- `src/app/admin/productos/ProductList.tsx` — abrir modal al editar

---

## 4. FAQ

### Modelo
- Nuevo modelo `Faq` en Prisma: id, question, answer, order (Int, default 0), isActive, createdAt, updatedAt

### Admin
- Nueva sección "FAQ" en el panel admin
- Lista de preguntas con modal para crear/editar
- Campo de orden para posicionar
- Botón activo/inactivo

### Página Pública (`/faqs`)
- Lista de preguntas activas ordenadas por `order`
- Estilo acordeón (click para expandir respuesta)
- Accesible desde footer

### API
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/faqs` | Lista pública de FAQs activas (ordenadas) |
| POST | `/api/admin/faqs` | Crear FAQ |
| PUT | `/api/admin/faqs/[id]` | Editar FAQ |
| DELETE | `/api/admin/faqs/[id]` | Eliminar FAQ |

### Archivos a crear/modificar
- `prisma/schema.prisma` — agregar Faq
- `src/app/api/faqs/route.ts` — GET público
- `src/app/api/admin/faqs/route.ts` — POST
- `src/app/api/admin/faqs/[id]/route.ts` — PUT, DELETE
- `src/app/admin/faqs/page.tsx` — página admin
- `src/app/admin/faqs/FaqForm.tsx` — modal form
- `src/app/admin/faqs/FaqList.tsx` — list component
- `src/app/faqs/page.tsx` — página pública
- `src/components/Footer.tsx` — agregar link a FAQ

---

## 5. Contacto en Home (WhatsApp, Email, Dirección)

### Cambio
- Teléfono: link `tel:+56959511421` + icono WhatsApp `https://wa.me/56959511421`
- Email: link `mailto:contacto@rotharworshop.cl`
- Dirección: link Google Maps `https://maps.google.com/?q=Pasaje+Los+Alvarado+7361+Bollenar+Chile`

### Archivos a modificar
- `src/components/Contact.tsx` — convertir divs estáticos en links funcionales

---

## 6. Admin Nav

### Cambio
- Agregar links a Categorías y FAQs en la navegación lateral

### Archivos a modificar
- `src/app/admin/AdminNav.tsx` — agregar items

---

## 7. Migración Prisma

- Ejecutar `npx prisma migrate dev --name add-categories-faqs`
- Ejecutar `npx prisma generate`

---

## Resumen de Archivos Nuevos

| Archivo | Propósito |
|---------|-----------|
| `src/app/api/categories/route.ts` | GET categorías públicas |
| `src/app/api/admin/categories/route.ts` | POST crear categoría |
| `src/app/api/admin/categories/[id]/route.ts` | PUT/DELETE categoría |
| `src/app/api/faqs/route.ts` | GET FAQs públicas |
| `src/app/api/admin/faqs/route.ts` | POST crear FAQ |
| `src/app/api/admin/faqs/[id]/route.ts` | PUT/DELETE FAQ |
| `src/app/admin/categorias/page.tsx` | Admin categorías |
| `src/app/admin/categorias/CategoryForm.tsx` | Modal form categoría |
| `src/app/admin/categorias/CategoryList.tsx` | Lista categorías |
| `src/app/admin/faqs/page.tsx` | Admin FAQs |
| `src/app/admin/faqs/FaqForm.tsx` | Modal form FAQ |
| `src/app/admin/faqs/FaqList.tsx` | Lista FAQs |
| `src/app/faqs/page.tsx` | Página pública FAQ |

## Archivos a Modificar

| Archivo | Cambio |
|---------|--------|
| `prisma/schema.prisma` | Agregar Category + Faq, modificar Product.category |
| `src/app/login/page.tsx` | Redirect admin a /admin |
| `src/app/admin/productos/page.tsx` | Modal en lugar de toggle |
| `src/app/admin/productos/ProductForm.tsx` | Categorías desde API + modo modal |
| `src/app/admin/productos/ProductList.tsx` | Modal al editar |
| `src/app/tienda/page.tsx` | Categorías desde API |
| `src/app/api/products/route.ts` | Filtrar por categoryId |
| `src/components/Contact.tsx` | Links funcionales |
| `src/components/Footer.tsx` | Link a FAQ |
| `src/app/admin/AdminNav.tsx` | Links a Categorías + FAQs |
