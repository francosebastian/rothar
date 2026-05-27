const { Pool } = require('pg')

const DATABASE_URL = process.env.DATABASE_URL!

async function main() {
  const pool = new Pool({ connectionString: DATABASE_URL })

  // 1. Map existing products to categories using the old `category` column
  const products = await pool.query(`SELECT id, slug, "category" FROM "Product" WHERE "categoryId" IS NULL`)
  console.log(`Productos sin categoryId: ${products.rows.length}`)

  if (products.rows.length > 0) {
    const categories = await pool.query(`SELECT id, name, slug FROM "Category"`)
    const catMap: Record<string, string> = {}
    for (const c of categories.rows) {
      catMap[c.name] = c.id
    }

    for (const p of products.rows) {
      const catName = p.category || 'Servicios'
      const catId = catMap[catName]
      if (catId) {
        await pool.query(`UPDATE "Product" SET "categoryId" = $1 WHERE id = $2`, [catId, p.id])
      }
    }
    console.log('Productos actualizados con categoryId')
  }

  // 2. Drop old category column if still exists
  const hasCategoryCol = await pool.query(
    `SELECT column_name::text FROM information_schema.columns WHERE table_name = 'Product' AND column_name = 'category'`
  )
  if (hasCategoryCol.rows.length > 0) {
    await pool.query(`ALTER TABLE "Product" DROP COLUMN "category"`)
    console.log('Columna category eliminada')
  }

  // 3. Add FK constraint if missing
  const hasFk = await pool.query(
    `SELECT tc.constraint_name::text FROM information_schema.table_constraints tc WHERE tc.table_name = 'Product' AND tc.constraint_type = 'FOREIGN KEY'`
  )
  if (hasFk.rows.length === 0) {
    await pool.query(
      `ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE`
    )
    console.log('FK constraint agregada')
  }

  // 4. Delete old posts and seed new ones
  const existingPosts = await pool.query(`SELECT id, title FROM "Post"`)
  console.log(`Posts existentes: ${existingPosts.rows.length}`)
  for (const post of existingPosts.rows) {
    await pool.query(`DELETE FROM "Post" WHERE id = $1`, [post.id])
  }
  console.log('Posts antiguos eliminados')

  const posts = [
    {
      title: '¡Bienvenidos al Nuevo Sitio Web de Rothar Workshop!',
      slug: 'bienvenidos-nuevo-sitio-web-rothar-workshop',
      content: `<p>¡Estamos muy contentos de anunciar el lanzamiento de nuestro nuevo sitio web! Hemos trabajado duro para crear una plataforma moderna, rápida y fácil de usar, pensada especialmente para la comunidad ciclista de Chile.</p>
<p>¿Qué puedes hacer en nuestro nuevo sitio?</p>
<h3>Tienda Online</h3>
<p>Compra componentes y accesorios para tu bicicleta desde la comodidad de tu casa. Contamos con un catálogo completo de grupos de transmisión microSHIFT, frenos, ruedas, dirección y mucho más. Puedes filtrar por categoría, buscar productos específicos y agregar todo a tu carrito de compras.</p>
<h3>Taller y Servicios</h3>
<p>Además de la venta de componentes, ofrecemos servicios de mantenimiento, reparación y personalización de bicicletas. Visítanos en nuestro taller en Bollenar o contáctanos para agendar una hora.</p>
<h3>Envíos a Todo Chile por Starken</h3>
<p>Despachamos tus pedidos a todo el país a través de Starken. Conoce los tiempos de entrega y costos según tu ubicación en nuestra sección de preguntas frecuentes.</p>
<h3>Múltiples Métodos de Pago</h3>
<p>Aceptamos tarjetas de débito y crédito a través de MercadoPago, transferencias bancarias y depósitos directos. Todo con la máxima seguridad.</p>
<h3>Carrito Persistente</h3>
<p>¿Encontraste algo que te gusta pero no quieres comprarlo ahora? No hay problema. Tu carrito se guarda automáticamente para que puedas retomar tu compra cuando quieras.</p>
<h2>¿Qué viene pronto?</h2>
<p>Estamos trabajando en nuevas funcionalidades como seguimiento de pedidos en tiempo real, reseñas de productos y un programa de fidelización para clientes frecuentes. ¡Mantente atento!</p>
<p>Te invitamos a explorar el sitio, conocer nuestros productos y servicios, y ser parte de la comunidad Rothar. Si tienes dudas, no dudes en contactarnos a través de nuestro formulario de contacto o directamente por WhatsApp.</p>
<p><strong>Rothar Workshop</strong> — Pasión por la mecánica y el ciclismo.</p>`,
      coverImage: null,
      isActive: true,
    },
    {
      title: 'Todo sobre los Grupos microSHIFT: ¿Cuál elegir para tu bici?',
      slug: 'todo-sobre-grupos-microshift-cual-elegir',
      content: `<p>microSHIFT se ha convertido en una de las marcas más populares en el mundo del ciclismo gracias a su excelente relación calidad-precio. Sus grupos de transmisión ofrecen un rendimiento comparable a marcas de gama alta, pero a una fracción del costo. En Rothar Workshop somos distribuidores autorizados y queremos ayudarte a elegir el grupo perfecto para tu bicicleta.</p>
<h2>Línea ADVENT (9 velocidades)</h2>
<p><strong>Precio: $149.900</strong></p>
<p>El grupo de entrada ideal para quienes quieren dar el salto al monoplato sin gastar de más. Ofrece un cassette 11-46T con rango suficiente para subir cualquier pendiente. Su desviador trasero cuenta con embrague (clutch) que evita que la cadena se salte en terrenos irregulares. Perfecto para MTB recreativo, urbano y commuter.</p>
<p><strong>Ideal para:</strong> Ciclistas que buscan una transmisión monoplato confiable y económica.</p>
<h2>Línea Acolyte (8 velocidades)</h2>
<p><strong>Precio: $110.990</strong></p>
<p>La opción más accesible de microSHIFT. Su cassette 12-46T ofrece un rango masivo para ser solo 8 velocidades. Incorpora el sistema SpringLock que mantiene la cadena tensa en terrenos bacheados. Sus componentes son más gruesos y duraderos, lo que se traduce en menor mantenimiento.</p>
<p><strong>Ideal para:</strong> Iniciación al MTB, bicicletas urbanas y quienes buscan máxima durabilidad al menor costo.</p>
<h2>Línea ADVENT X (10 velocidades)</h2>
<p><strong>Precio: $179.900</strong></p>
<p>El equilibrio perfecto entre rendimiento y precio. Su cassette 11-48T ofrece un desarrollo del 436%, ideal para quienes necesitan más rangos de marcha sin llegar a los precios de 11 o 12 velocidades. El embrague de trinquete ajustable permite activar/desactivar el clutch fácilmente para sacar la rueda trasera.</p>
<p><strong>Ideal para:</strong> MTB intermedio, trail y gravel con presupuesto ajustado.</p>
<h2>Línea ADVENT MX (11 velocidades)</h2>
<p><strong>Precio: $315.000</strong></p>
<p>El tope de gama de microSHIFT para MTB. Diseñado específicamente para soportar las exigencias del trail, enduro y bicicletas eléctricas. Su cassette 11-50T ofrece un desarrollo del 455%. El desviador Pro tiene un embrague 33% más fuerte y la tecnología SpeedRamp permite cambios ultra rápidos incluso bajo carga.</p>
<p><strong>Ideal para:</strong> MTB agresivo, enduro, e-bikes y ciclistas exigentes.</p>
<h2>Línea SWORD para Gravel</h2>
<h3>SWORD Black 9v — $261.000</h3>
<p>Diseñado exclusivamente para bicicletas gravel con manillar dropbar. Cassette 11-46T con look completamente negro. Las manillas integradas ofrecen ergonomía superior para largas jornadas sobre la bicicleta. Incluye cassette, cambio trasero con embrague y manilla derecha de cambio/freno.</p>
<h3>SWORD 10v — $336.000</h3>
<p>El grupo insignia para gravel y bikepacking. Cassette 11-48T (monoplato) o 11-38T (biplato). El desviador trasero cuenta con tensor orbital que protege la funda del cable de rozaduras con bolsas de cuadro. Ergonomía de primer nivel con cuerpo ensanchado y texturizado para un agarre firme.</p>
<p><strong>Ideal para:</strong> Gravel, bikepacking, rutas mixtas y cicloturismo.</p>
<h2>¿Cómo elegir?</h2>
<p>Si vienes de una bicicleta con cambios tradicionales y quieres algo simple y duradero: <strong>Acolyte 8v</strong> o <strong>ADVENT 9v</strong>.<br>
Si haces MTB de forma regular y quieres más rangos: <strong>ADVENT X 10v</strong>.<br>
Si eres un rider exigente o tienes e-bike: <strong>ADVENT MX 11v</strong>.<br>
Si tienes una gravel o haces cicloturismo: <strong>SWORD 9v o 10v</strong>.</p>
<p>¿Tienes dudas sobre cuál elegir? <a href="/contacto">Contáctanos</a> y te asesoramos sin compromiso. Todos los grupos están disponibles en nuestra <a href="/tienda">tienda online</a> con envío a todo Chile.</p>`,
      coverImage: null,
      isActive: true,
    },
  ]

  for (const post of posts) {
    await pool.query(
      `INSERT INTO "Post" (id, title, slug, content, "coverImage", "isActive", "createdAt", "updatedAt") VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, NOW(), NOW())`,
      [post.title, post.slug, post.content, post.coverImage, post.isActive]
    )
  }
  console.log('Posts creados:', posts.length)

  // 5. Seed FAQs
  const existingFaqs = await pool.query(`SELECT COUNT(*)::int as count FROM "Faq"`)
  console.log(`FAQs existentes: ${existingFaqs.rows[0].count}`)

  if (existingFaqs.rows[0].count === 0) {
    const faqs = [
      { question: '¿Cuáles son los métodos de pago disponibles?', answer: 'Aceptamos pagos con tarjetas de débito y crédito (Visa, MasterCard, Amex) a través de MercadoPago, transferencia bancaria y depósito directo. En compras online puedes pagar con MercadoPago en cuotas sin interés según promociones vigentes.', order: 1 },
      { question: '¿Realizan envíos a todo Chile?', answer: 'Sí, hacemos envíos a todo el país a través de Starken. El costo y tiempo de entrega varían según tu ubicación. Los pedidos se despachan dentro de las 24-48 hrs hábiles siguientes a la confirmación del pago.', order: 2 },
      { question: '¿Cuánto demora el despacho por Starken?', answer: 'Una vez despachado, Starken entrega en 2-5 días hábiles en zonas urbanas y 5-10 días hábiles en zonas rurales o extremas. Recibirás un número de seguimiento para rastrear tu pedido en la página de Starken.', order: 3 },
      { question: '¿Puedo retirar mi pedido en el taller?', answer: 'Sí, puedes retirar sin costo adicional en nuestro taller ubicado en Pasaje Los Alvarado #7361, Bollenar, Chile. Te avisaremos cuando tu pedido esté listo para retiro.', order: 4 },
      { question: '¿Cuál es la política de cambios y devoluciones?', answer: 'Aceptamos cambios y devoluciones dentro de los 10 días corridos desde la recepción del producto. El producto debe estar en su estado original, sin uso y con todos sus empaques. Los costos de envío por devolución los cubre el cliente, excepto si el producto llegó defectuoso o con error.', order: 5 },
      { question: '¿Cómo puedo rastrear mi pedido?', answer: 'Una vez despachado, te enviaremos un email con el número de seguimiento de Starken. Puedes rastrear tu pedido directamente en la web de Starken (www.starken.cl) ingresando ese número.', order: 6 },
      { question: '¿Hacen instalación de los productos comprados?', answer: 'Sí, si compras componentes en nuestra tienda online, podemos instalarlos en tu bicicleta en nuestro taller. Solicitalo al momento de la compra o contáctanos para agendar una hora. El costo de instalación varía según el producto.', order: 7 },
      { question: '¿Ofrecen garantía en los productos?', answer: 'Todos los productos nuevos cuentan con la garantía legal de 3 meses. Los grupos y componentes microSHIFT tienen garantía del fabricante contra defectos de fábrica. La garantía no cubre el desgaste por uso normal, instalación incorrecta o daños por accidente.', order: 8 },
    ]
    for (const faq of faqs) {
      await pool.query(
        `INSERT INTO "Faq" (id, question, answer, "order", "isActive", "createdAt", "updatedAt") VALUES (gen_random_uuid()::text, $1, $2, $3, $4, NOW(), NOW())`,
        [faq.question, faq.answer, faq.order, true]
      )
    }
    console.log('FAQs creadas:', faqs.length)
  }

  console.log('Seed completado')
  await pool.end()
}

main().catch((e) => { console.error('Error:', e); process.exit(1) })
