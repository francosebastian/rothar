# Feature Execution Plan

Cada feature sigue este ciclo obligatorio:

```
[Planificar] → [Implementar] → [Build] → [Reset DB + seed] → [Actualizar FEATURES.md en la branch] → [Revision manual por el usuario] → [Aprobacion explicita del usuario] → [Merge a main + push]
```

**Reglas estrictas:**

1. **No se pasa a la siguiente feature hasta que la actual recibe aprobacion explicita del usuario.**
2. **No se mergea ni pushea automaticamente.** Solo cuando el usuario dice explicitamente "aprobado" o "mergea" se realiza el merge a main y push.
3. **La branch se muestra al usuario para revision manual** antes de cualquier merge.
4. **FEATURES.md se actualiza en la feature branch** (no en main) para evitar builds duplicados en produccion.
5. **Las migraciones de Prisma deben ir en el mismo commit que los cambios del schema.** Verificar con `git status` que `prisma/migrations/<nombre>/` esté staged. Si falta, Vercel no aplica la migracion y la prod falla.

```
Si corres localmente con `npm run dev`, asegurate de tener la base de datos corriendo y las migraciones aplicadas.

Todos los tests usan el puerto **3000** (puerto por defecto de Next.js).
```

---

## Estado de features

| Feature | Estado | Commit |
|---|---|---|
| F1 — Categorías Dinámicas | ✅ Completado | — |
| F2 — Admin Login Redirect | ✅ Completado | — |
| F3 — Product CRUD en Modal | ✅ Completado | — |
| F4 — FAQ CRUD | ✅ Completado | — |
| F5 — Contacto funcional | ✅ Completado | — |
| F6 — Admin Nav completo | ✅ Completado | — |
| F7 — SEO: Sitemap + robots.txt + Schema.org | ✅ Completado | `6adf494` |
| F8 — Error pages: error.tsx + not-found.tsx | ✅ Completado | `09be7e7` |
| F9 — Tipar `any` en API routes y libs | ⏳ Pendiente | — |
| F10 — Migrar `<img>` a `next/image` | ⏳ Pendiente | — |
| F11 — Habilitar cacheComponents (PPR) | ⏳ Pendiente | — |
| F12 — Validación Zod en route handlers | ⏳ Pendiente | — |
| F13 — SWR para ProductForm | ⏳ Pendiente | — |
| F14 — React.memo en listas | ⏳ Pendiente | — |
| F15 — Seed.ts: require() → imports estáticos | ⏳ Pendiente | — |
| F16 — Rate limiting en API | ⏳ Pendiente | — |
| F17 — Health check endpoint | ⏳ Pendiente | — |

---

Cada feature nueva crea su propia branch desde `main` con el formato `feature/F{n}-{nombre}`. Una vez implementada, el agente muestra la branch para revision manual. Solo cuando el usuario dice explicitamente "aprobado" o "mergea", se ejecuta:

```bash
git checkout main
git merge feature/F{n}-{nombre}
git push origin main
```

**No se mergea ni pushea ninguna feature sin aprobacion manual explicita del usuario. No se acumulan features en una misma branch.**

---

## F1 — Categorías Dinámicas

**Objetivo**: Modelo Category en Prisma, CRUD admin, filtro en tienda pública.

**Archivos creados/modificados**:
- `prisma/schema.prisma` — modelo Category, FK en Product.categoryId
- `src/app/api/categories/route.ts` — GET público
- `src/app/api/admin/categories/route.ts` — POST
- `src/app/api/admin/categories/[id]/route.ts` — PUT, DELETE
- `src/app/admin/categorias/page.tsx` — admin page con modal CRUD
- `src/app/admin/productos/ProductForm.tsx` — carga categorías desde API
- `src/app/tienda/page.tsx` — filtro por categoría
- `src/app/api/products/route.ts` — filter por category slug
- `prisma/seed.ts` — categorías default

**Criterio de aprobacion**:
- Build exitoso (`npm run build`)
- Admin puede crear/editar/eliminar categorías
- ProductForm carga categorías en dropdown
- Tienda filtra productos por categoría

---

## F2 — Admin Login Redirect

**Objetivo**: Redirigir admin a `/admin` después de login.

**Archivos modificados**:
- `src/app/login/page.tsx` — verifica `session.user.role === 'ADMIN'`, redirige a `/admin`

**Criterio de aprobacion**:
- Build exitoso
- Login con admin redirige a `/admin`
- Login con client redirige a `/`

---

## F3 — Product CRUD en Modal

**Objetivo**: Formulario de producto en modal overlay.

**Archivos modificados**:
- `src/app/admin/productos/ProductForm.tsx` — modal overlay con backdrop click
- `src/app/admin/productos/ProductList.tsx` — trigger modal al crear/editar

**Criterio de aprobacion**:
- Build exitoso
- Modal se abre al hacer clic en "Agregar Producto" y "Editar"
- Backdrop click cierra modal
- Botón X cierra modal

---

## F4 — FAQ CRUD

**Objetivo**: Modelo Faq, CRUD admin, página pública con acordeón.

**Archivos creados/modificados**:
- `prisma/schema.prisma` — modelo Faq
- `src/app/api/faqs/route.ts` — GET público (activas, por order)
- `src/app/api/admin/faqs/route.ts` — GET + POST
- `src/app/api/admin/faqs/[id]/route.ts` — PUT, DELETE
- `src/app/admin/faqs/page.tsx` — admin CRUD con modal
- `src/app/faqs/page.tsx` — página pública acordeón
- `src/components/Footer.tsx` — link a `/faqs`
- `prisma/seed.ts` — 8 FAQs default

**Criterio de aprobacion**:
- Build exitoso
- Admin crea/edita/elimina FAQs con orden y toggle activo
- `/faqs` muestra acordeón con preguntas activas ordenadas

**Pruebas de validacion**:
```bash
curl -s http://localhost:3000/api/faqs | grep -o '"question":"[^"]*"' | head -3
```

---

## F5 — Contacto funcional

**Objetivo**: Links funcionales en sección de contacto.

**Archivos modificados**:
- `src/components/Contact.tsx` — WhatsApp `wa.me/56959511421`, email `mailto:`, Maps Google embed

**Criterio de aprobacion**:
- Build exitoso
- WhatsApp abre link correcto
- Email abre cliente de correo
- Maps muestra ubicación

---

## F6 — Admin Nav completo

**Objetivo**: Sidebar admin con todas las secciones.

**Archivos modificados**:
- `src/app/admin/AdminNav.tsx` — links a Dashboard, Productos, Categorías, Blog, FAQ, Pedidos, Usuarios

**Criterio de aprobacion**:
- Build exitoso
- Sidebar muestra todas las secciones
- Links navegan correctamente

---

## F7 — SEO: Sitemap + robots.txt + Schema.org

**Objetivo**: Completar SEO técnico del sitio.

**Archivos a crear**:
- `src/app/sitemap.ts` — sitemap dinámico con productos y blog
- `src/app/robots.ts` — robots.txt con reglas para crawlers
- `src/app/faqs/page.tsx` — agregar JSON-LD FAQPage

**Criterio de aprobacion**:
- Build exitoso
- `GET /sitemap.xml` devuelve URLs de productos y blog
- `GET /robots.txt` devuelve reglas correctas
- `/faqs` tiene `<script type="application/ld+json">` con FAQPage

**Pruebas de validacion**:
```bash
curl -s http://localhost:3000/sitemap.xml | grep -o '<loc>[^<]*</loc>'
curl -s http://localhost:3000/robots.txt
curl -s http://localhost:3000/faqs | grep -o '"@type":"FAQPage"'
```

---

## F8 — Error pages: error.tsx + not-found.tsx

**Objetivo**: Manejo de errores y 404 amigables.

**Archivos a crear**:
- `src/app/error.tsx` — error boundary global con botón reintentar
- `src/app/not-found.tsx` — página 404 con navegación

**Criterio de aprobacion**:
- Build exitoso
- Error inesperado muestra UI amigable con reintentar
- Ruta inexistente muestra 404 personalizada

**Pruebas de validacion**:
```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/nonexistent
# Debe ser 404 (no 500)
```

---

## F9 — Tipar `any` en API routes y libs

**Objetivo**: Eliminar usos de `any` en código de producción.

**Archivos a modificar**:
- `src/app/api/products/route.ts` — tipar `where: Prisma.ProductWhereInput`
- `src/lib/auth.ts` — tipar callback params con tipos de NextAuth
- `src/lib/email.ts` — tipar params de Resend
- `src/lib/youtube.ts` — tipar response de YouTube API

**Criterio de aprobacion**:
- Build exitoso (`npx tsc --noEmit` sin errores)
- No hay `: any` ni `as any` en archivos modificados

**Pruebas de validacion**:
```bash
grep -n ": any" src/app/api/products/route.ts src/lib/auth.ts src/lib/email.ts src/lib/youtube.ts
# Debe devolver 0 matches (o solo los justificados)
```

---

## F10 — Migrar `<img>` a `next/image`

**Objetivo**: Usar `next/image` para optimización de imágenes.

**Archivos a modificar**:
- `src/app/admin/productos/ProductList.tsx` — reemplazar `<img>` por `<Image>` de `next/image`

**Criterio de aprobacion**:
- Build exitoso
- No hay `<img>` sin optimizar en ProductList

**Pruebas de validacion**:
```bash
grep -c '<img ' src/app/admin/productos/ProductList.tsx
# Debe ser 0
```

---

## F11 — Habilitar cacheComponents (PPR)

**Objetivo**: Habilitar Partial Prerendering para productos y categorías.

**Archivos a modificar**:
- `next.config.ts` — agregar `cacheComponents: true`
- `src/app/api/products/route.ts` — agregar `'use cache'` + `cacheLife`
- `src/app/api/categories/route.ts` — agregar `'use cache'` + `cacheTag`

**Criterio de aprobacion**:
- Build exitoso
- `cacheComponents: true` en config
- Productos y categorías tienen `'use cache'`

**Pruebas de validacion**:
```bash
grep -c "cacheComponents" next.config.ts
# Debe ser 1
```

---

## F12 — Validación Zod en route handlers

**Objetivo**: Validar request body con Zod en vez de checks manuales.

**Archivos a crear**:
- `src/lib/validations/product.ts` — schema producto
- `src/lib/validations/category.ts` — schema categoría
- `src/lib/validations/faq.ts` — schema FAQ
- `src/lib/validations/index.ts` — barrel

**Archivos a modificar**:
- `src/app/api/admin/products/route.ts` — validar con Zod
- `src/app/api/admin/categories/route.ts` — validar con Zod
- `src/app/api/admin/faqs/route.ts` — validar con Zod
- `src/app/api/pedidos/route.ts` — validar con Zod

**Criterio de aprobacion**:
- Build exitoso
- Body inválido responde 400 con errores detallados
- Los schemas se reutilizan entre route handlers

**Pruebas de validacion**:
```bash
curl -s -X POST http://localhost:3000/api/admin/categories \
  -H "Content-Type: application/json" \
  -d '{}' | grep -o '"error"'
# Debe mostrar error de validación
```

---

## F13 — SWR para ProductForm

**Objetivo**: Reemplazar useEffect + fetch por SWR para carga de categorías.

**Archivos a modificar**:
- `package.json` — agregar `swr`
- `src/app/admin/productos/ProductForm.tsx` — usar `useSWR('/api/categories')`

**Criterio de aprobacion**:
- Build exitoso
- Categorías se cargan con SWR (caching + revalidación automática)

**Pruebas de validacion**:
```bash
npm ls swr 2>&1 | head -3
grep -c "useSWR" src/app/admin/productos/ProductForm.tsx
# Debe ser > 0
```

---

## F14 — React.memo en listas

**Objetivo**: Evitar re-renders innecesarios en listas del admin.

**Archivos a modificar**:
- `src/app/admin/productos/ProductList.tsx` — envolver filas con `React.memo`
- `src/app/admin/pedidos/OrderItemsModal.tsx` — `React.memo` en items

**Criterio de aprobacion**:
- Build exitoso
- Componentes de lista tienen `React.memo`

**Pruebas de validacion**:
```bash
grep -c "React.memo\|memo(" src/app/admin/productos/ProductList.tsx
grep -c "React.memo\|memo(" src/app/admin/pedidos/OrderItemsModal.tsx
```

---

## F15 — Seed.ts: require() → imports estáticos

**Objetivo**: Eliminar `require()` dinámico en seed.ts usando `await import()`.

**Archivos a modificar**:
- `prisma/seed.ts` — reemplazar `require()` condicional por `await import()`

**Criterio de aprobacion**:
- Build exitoso
- Seed corre sin errores
- ESLint no reporta `require()` en seed.ts

**Pruebas de validacion**:
```bash
npx eslint prisma/seed.ts 2>&1 | grep "require-imports" || echo "OK: no require()"
npx tsx prisma/seed.ts 2>&1 | tail -5
```

---

## F16 — Rate limiting en API

**Objetivo**: Proteger API routes de abusos.

**Archivos a modificar**:
- `package.json` — agregar `@upstash/ratelimit` o implementar in-memory
- `src/lib/rate-limit.ts` — **CREAR**: helper de rate limiting
- `src/app/api/pedidos/route.ts` — aplicar rate limit
- `src/app/api/registro/route.ts` — aplicar rate limit
- `src/app/api/mercadopago/preference/route.ts` — aplicar rate limit

**Criterio de aprobacion**:
- Build exitoso
- Más de N requests/min desde misma IP reciben 429

**Pruebas de validacion**:
```bash
for i in $(seq 1 20); do
  curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:3000/api/registro \
    -H "Content-Type: application/json" \
    -d '{"name":"test","email":"test@test.com","password":"12345678"}'
  echo ""
done
# Últimas requests deben devolver 429
```

---

## F17 — Health check endpoint

**Objetivo**: Endpoint de salud para monitoreo.

**Archivos a crear**:
- `src/app/api/health/route.ts` — GET que verifica DB + uptime

**Criterio de aprobacion**:
- Build exitoso
- `GET /api/health` responde 200 con `{ status: "ok", db: "connected", uptime }`
- Si DB falla, responde 503

**Pruebas de validacion**:
```bash
curl -s http://localhost:3000/api/health
# Debe devolver JSON con status: "ok"
```

---

## Flujo de trabajo con opencode

Las features son **secuenciales** porque cada una toca archivos que la siguiente podria necesitar. Para paralelizar tareas dentro de una misma feature, se puede usar el comando `/task` de opencode para lanzar sub-agentes independientes.

Ejemplo dentro de una feature:
```
/task "Crea schemas Zod para productos, categorías y FAQs"
/task "Implementa validación en route handlers de admin"
```
Ambos pueden ejecutarse en paralelo porque no dependen entre si.
