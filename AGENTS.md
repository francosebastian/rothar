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
- DB: PostgreSQL + Prisma 7
- Estilos: Tailwind CSS 4
- Auth: NextAuth v5
- Pagos: MercadoPago
- Estado cliente: Zustand 5
- Email: Resend
- Uploads: UploadCare

## Comandos

- Dev: `npm run dev`
- Build: `npm run build`
- Prisma generate: `npx prisma generate`
- Prisma migrate: `npx prisma migrate dev`
- Docker DB: `docker compose up -d`
- Lint: `npm run lint`
- Typecheck: `npx tsc --noEmit`
