import { PrismaClient } from '../src/generated/prisma'
import { hash } from 'bcryptjs'
import { UserRole } from '../src/generated/prisma'

function createPrismaClient() {
  const url = process.env.DATABASE_URL!

  if (process.env.VERCEL || url.includes('neon.tech')) {
    const { PrismaNeon } = require('@prisma/adapter-neon')
    const adapter = new PrismaNeon({ connectionString: url })
    return new PrismaClient({ adapter })
  }

  const { PrismaPg } = require('@prisma/adapter-pg')
  const adapter = new PrismaPg({ connectionString: url })
  return new PrismaClient({ adapter })
}

const prisma = createPrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@rothar.com' },
    update: {},
    create: {
      email: 'admin@rothar.com',
      name: 'Administrador',
      passwordHash: adminPassword,
      role: UserRole.ADMIN,
      phone: '123456789',
    },
  })
  console.log('Admin user created:', admin.email)

  // Create default categories
  const defaultCategories = [
    { name: 'Transmisión', slug: 'transmision' },
    { name: 'Frenos', slug: 'frenos' },
    { name: 'Ruedas', slug: 'ruedas' },
    { name: 'Dirección', slug: 'direccion' },
    { name: 'Sillín', slug: 'sillin' },
    { name: 'Servicios', slug: 'servicios' },
  ]

  for (const cat of defaultCategories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }
  console.log('Default categories created')

  // Create default products
  const transmisionId = (await prisma.category.findUnique({ where: { slug: 'transmision' } }))!.id
  const frenosId = (await prisma.category.findUnique({ where: { slug: 'frenos' } }))!.id

  const products = [
    {
      name: 'test1', slug: 'test1', price: 1000, image: 'https://goc9lmmt47.ucarecd.net/1a4baadb-938c-4c68-bf2e-2cba71230fa6/herramientas.webp',
      description: 'probando', stock: 1, sku: '1234', isActive: false, categoryId: frenosId,
    },
    {
      name: 'GROUPSET MICROSHIFT ADVENT 9V', slug: 'GROUPSET-ADVENT9V', price: 149900, featured: true,
      image: 'https://goc9lmmt47.ucarecd.net/ec252fa4-bd47-49c5-8f92-7d2199ad8c45/1000035016.jpg',
      description: `Grupo Transmisión microSHIFT ADVENT 9v (1x9)
La evolución del monoplato: ultra resistente, preciso y económico.
Ideal para MTB, trail o urbanas, el grupo ADVENT de 9 velocidades ofrece el rendimiento y rango de transmisiones de gama alta, pero con la durabilidad y bajo costo de mantenimiento de los componentes de 9v.
Lo más importante:
Rango brutal (Piñón 11-46T): Sube cualquier pendiente con total soltura gracias a su cassette de amplio desarrollo.
Cambio con embrague (Clutch): Olvídate de los saltos y salidas de cadena; el desviador trasero la mantiene siempre firme en terrenos rotos.
Shifter preciso: Cambios de marcha rápidos, con una respuesta táctil y firme en cada clic.
Durabilidad garantizada: Cadena y piñones más gruesos que resisten mucho mejor el desgaste y el trato duro.`,
      stock: 3, sku: undefined, isActive: true, categoryId: transmisionId,
    },
    {
      name: 'GROUPSET MICROSHIFT ACCOLYTE  8v', slug: 'GRUPSET-ACCOLYTE-8V', price: 110990,
      image: 'https://goc9lmmt47.ucarecd.net/389d6b61-5ebb-47f5-83cc-13e32f6495ae/1000035019.jpg',
      description: `Grupo Transmisión microSHIFT Acolyte 8v (1x8)
El monoplato más accesible y resistente para iniciarse en el MTB.
Diseñado específicamente para quienes buscan la simplicidad del monoplato sin complicar el presupuesto. El grupo Acolyte de 8 velocidades destaca por ofrecer un rango de marcha gigantesco y una robustez ideal para el ciclismo de montaña recreativo o urbano.
Lo más importante:
Rango masivo (Piñón 12-46T): Su cassette rompe los esquemas de las 8 velocidades, entregando un desarrollo idéntico al de gamas altas para subir cualquier cerro sin esfuerzo.
Retención de cadena SpringLock: El cambio trasero incluye un sistema de embrague innovador que mantiene la cadena tensa, evitando ruidos y caídas en terrenos bacheados.
Operación simple y directa: Menos marchas significan un ajuste más fácil, menor mantenimiento y componentes más gruesos y duraderos contra el desgaste.`,
      stock: 3, sku: '002', isActive: true, categoryId: transmisionId,
    },
    {
      name: 'GROUPSET MICROSHIFT ADVENTX', slug: 'GROUPSET-ADVENTX10V', price: 179900, featured: true,
      image: 'https://goc9lmmt47.ucarecd.net/9dd9bab2-7ab2-44c6-8fb5-44ce23ec2b28/1000035038.jpg',
      description: `Grupo Transmisión microSHIFT ADVENT X 10v (1x10)
Rendimiento de gama alta a una fracción del peso y del costo.
El grupo ADVENT X de 10 velocidades es el tope de línea de la marca para MTB y gravel. Está diseñado para ciclistas que buscan un rango competitivo y ligereza extrema, compitiendo codo a codo en rendimiento con transmisiones tradicionales de 11 o 12 velocidades.
Lo más importante:
Rango óptimo (Piñón 11-48T): Su cassette de 10 velocidades ofrece un desarrollo gigantesco (436%) para trepar los senderos más duros con un escalonamiento de marchas muy fluido.
Embrague de trinquete ajustable: El cambio trasero cuenta con un sistema de clutch de alta resistencia que elimina por completo el golpeteo de la cadena, siendo además muy fácil de activar o desactivar para sacar la rueda.
Ligereza sorprendente: El cassette utiliza arañas y piñones de aluminio en sus coronas más grandes, logrando un peso notablemente inferior al de sus competidores directos.
Ergonomía Trail: Shifters con almohadillas de silicona texturizadas que aseguran un agarre y control perfectos, incluso en las condiciones más húmedas o técnicas.`,
      stock: 3, sku: '003', isActive: true, categoryId: transmisionId,
    },
    {
      name: 'GROUPSET MICROSHIFT ADVENT MX', slug: 'GROUPSET-ADVENTMX-11V', price: 315000,
      image: 'https://goc9lmmt47.ucarecd.net/a77b62b9-05c5-4d53-9e50-bc5c281e965d/1000035039.jpg',
      description: `Grupo Transmisión microSHIFT ADVENT MX 11v (1x11)
El nuevo estándar para el MTB agresivo y E-Bikes: indestructible y de rango masivo.
La serie ADVENT MX de 11 velocidades es el rediseño más robusto y de alto rendimiento en la historia de la marca. Diseñado específicamente para soportar las exigencias del trail técnico, enduro y el torque de las bicicletas eléctricas, ofrece una alternativa ultra confiable frente a los complejos sistemas de 12 velocidades.
Lo más importante:
Rango masivo (Piñón 11-50T): Rompe los límites con un cassette de 11-50 dientes que entrega un desarrollo del 455%, ideal para trepar los senderos más empinados sin perder fluidez.
Tecnología SpeedRamp: El cassette cuenta con rampas de cambio bidireccionales optimizadas, lo que permite pasos de marcha extremadamente rápidos y suaves, incluso aplicando fuerza en plena subida.
Desviador Pro con Embrague un 33% más fuerte: Su arquitectura con paralelogramo horizontal e imponentes bujes IGUS aísla las fuerzas del terreno, eliminando por completo los ruidos y salidas de cadena en los descensos más rotos.
Shifter de respuesta instantánea: Rediseñado con un mecanismo que elimina el juego muerto, logrando un enganche hasta 4 veces más rápido que las series anteriores y permitiendo cambios dobles precisos.
Durabilidad extrema: Incorpora coronas de cromoly endurecido en los piñones pequeños (los de mayor desgaste), garantizando una vida útil hasta 6 veces más larga.`,
      stock: 3, sku: '004', isActive: true, categoryId: transmisionId,
    },
    {
      name: 'GROUPSET MICROSHIFT SWORD BLACK 9V', slug: 'GROUPSET-SWORD-BLACK-9V', price: 261000,
      image: 'https://goc9lmmt47.ucarecd.net/533ba372-0d37-4461-803a-7d2c14f867a4/1000035120.webp',
      description: `Grupo Transmisión microSHIFT SWORD Black 9v (1x9)
El espíritu del Gravel moderno: simple, estético y diseñado para la aventura.
La serie SWORD Black lleva el rendimiento del gravel a un sistema monoplato de 9 velocidades altamente eficiente. Diseñado con una ergonomía superior para manillares de dropbar (ruta/gravel), combina un look impecable completamente negro con la resistencia necesaria para salir del asfalto.
Lo más importante:
Rango óptimo Gravel (Piñón 11-46T): Su cassette ofrece el desarrollo perfecto para enfrentar caminos de tierra empinados cargando equipaje, sin perder velocidad en los tramos planos de pavimento.
Ergonomía de manilla mejorada: Las palancas integradas (Drop Bar Shifters) cuentan con un cuerpo texturizado antideslizante y un pivote de freno más alto que aumenta la palanca, entregando un frenado potente y cómodo desde los escalones.
Embrague integrado (Clutch): El cambio trasero cuenta con un estabilizador mecánico que mantiene la cadena tensa en caminos de ripio, baches o senderos, eliminando ruidos y previniendo caídas.
Mantenimiento simplificado: Al ser un sistema de 9 marchas, ofrece una tolerancia de regulación muy amigable, una durabilidad sobresaliente ante el barro y el polvo, y costos de repuesto muy contenidos.
El kit incluye: Cassette 11-46T, Cambio Trasero con embrague y Manilla Derecha de cambio/freno integrada para manillar Drop Bar.`,
      stock: 5, sku: '0005', isActive: true, categoryId: transmisionId,
    },
    {
      name: 'GROUPSET MICROSHIFT SWORD 10V', slug: 'GROUPSET-SWORD10V', price: 336000, featured: true,
      image: 'https://goc9lmmt47.ucarecd.net/f1e7d2a0-b2ac-4f4a-996c-3ec796d94bdc/1000035121.jpg',
      description: `La serie SWORD de 10 velocidades es el grupo insignia de la marca diseñado exclusivamente para Gravel y Bikepacking. Diseñado desde cero para manillares de ruta/gravel (dropbar), ofrece un equilibrio impecable entre peso, rango de desarrollos y una ergonomía de primer nivel para pasar largas jornadas sobre la bicicleta.
Lo más importante:
Rango masivo para subidas (Piñón 11-48T en monoplato): Diseñado para trepar los caminos de tierra más empinados con carga, ofreciendo un desarrollo del 436% (también disponible en versión biplato 2x10 con cassette 11-38T).
Manillas con ergonomía de vanguardia: Las palancas cuentan con un cuerpo ensanchado y texturizado para un agarre firme en zonas técnicas. Su pivote de freno elevado aumenta la fuerza de palanca, permitiendo frenar con total potencia y menos esfuerzo usando solo dos dedos desde los escalones.
Cambio con embrague e innovador tensor orbital: El desviador trasero incluye un embrague de alta resistencia que elimina los ruidos y saltos de cadena. Además, su entrada de cable gira sobre un pivote orbital, protegiendo la funda y el cable de rozaduras con las bolsas de cuadro (framebags).
Mantenimiento amigable en ruta: Mantiene el ajuste de forma excelente ante el barro y las vibraciones. Al ser de 10 velocidades, utiliza una cadena más robusta y fácil de conseguir en cualquier lugar del mundo.
El kit incluye: Cassette de rango extendido (11-48T o 11-38T), Cambio Trasero con embrague orbital y Manilla Derecha de cambio/freno integrada (opcional manilla izquierda para biplato o manilla izquierda limpia para freno hidráulico/mecánico solo).`,
      stock: 3, sku: '006', isActive: true, categoryId: transmisionId,
    },
  ]

  for (const data of products) {
    await prisma.product.upsert({
      where: { slug: data.slug },
      update: { featured: data.featured },
      create: data,
    })
  }
  console.log('Default products created')

  // Create default FAQs
  const faqs = [
    {
      question: '¿Cuáles son los métodos de pago disponibles?',
      answer: 'Aceptamos pagos con tarjetas de débito y crédito (Visa, MasterCard, Amex) a través de MercadoPago, transferencia bancaria y depósito directo. En compras online puedes pagar con MercadoPago en cuotas sin interés según promociones vigentes.',
      order: 1,
    },
    {
      question: '¿Realizan envíos a todo Chile?',
      answer: 'Sí, hacemos envíos a todo el país a través de Starken. El costo y tiempo de entrega varían según tu ubicación. Los pedidos se despachan dentro de las 24-48 hrs hábiles siguientes a la confirmación del pago.',
      order: 2,
    },
    {
      question: '¿Cuánto demora el despacho por Starken?',
      answer: 'Una vez despachado, Starken entrega en 2-5 días hábiles en zonas urbanas y 5-10 días hábiles en zonas rurales o extremas. Recibirás un número de seguimiento para rastrear tu pedido en la página de Starken.',
      order: 3,
    },
    {
      question: '¿Puedo retirar mi pedido en el taller?',
      answer: 'Sí, puedes retirar sin costo adicional en nuestro taller ubicado en Pasaje Los Alvarado #7361, Bollenar, Chile. Te avisaremos cuando tu pedido esté listo para retiro.',
      order: 4,
    },
    {
      question: '¿Cuál es la política de cambios y devoluciones?',
      answer: 'Aceptamos cambios y devoluciones dentro de los 10 días corridos desde la recepción del producto. El producto debe estar en su estado original, sin uso y con todos sus empaques. Los costos de envío por devolución los cubre el cliente, excepto si el producto llegó defectuoso o con error.',
      order: 5,
    },
    {
      question: '¿Cómo puedo rastrear mi pedido?',
      answer: 'Una vez despachado, te enviaremos un email con el número de seguimiento de Starken. Puedes rastrear tu pedido directamente en la web de Starken (www.starken.cl) ingresando ese número.',
      order: 6,
    },
    {
      question: '¿Hacen instalación de los productos comprados?',
      answer: 'Sí, si compras componentes en nuestra tienda online, podemos instalarlos en tu bicicleta en nuestro taller. Solicitalo al momento de la compra o contáctanos para agendar una hora. El costo de instalación varía según el producto.',
      order: 7,
    },
    {
      question: '¿Ofrecen garantía en los productos?',
      answer: 'Todos los productos nuevos cuentan con la garantía legal de 3 meses. Los grupos y componentes microSHIFT tienen garantía del fabricante contra defectos de fábrica. La garantía no cubre el desgaste por uso normal, instalación incorrecta o daños por accidente.',
      order: 8,
    },
  ]

  for (const faq of faqs) {
    const existing = await prisma.faq.findFirst({ where: { question: faq.question } })
    if (!existing) await prisma.faq.create({ data: faq })
  }
  console.log('Default FAQs created')

  // Create default blog posts
  const posts = [
    {
      title: '¡Bienvenidos al Nuevo Sitio Web de Rothar Workshop!',
      slug: 'bienvenidos-nuevo-sitio-web-rothar-workshop',
      content: `<p>¡Estamos muy contentos de anunciar el lanzamiento de nuestro nuevo sitio web! Hemos trabajado duro para crear una plataforma moderna, rápida y fácil de usar, pensada especialmente para la comunidad ciclista de Chile.</p>

<h2>¿Qué puedes hacer en nuestro nuevo sitio?</h2>

<h3>🛒 Tienda Online</h3>
<p>Compra componentes y accesorios para tu bicicleta desde la comodidad de tu casa. Contamos con un catálogo completo de grupos de transmisión microSHIFT, frenos, ruedas, dirección y mucho más. Puedes filtrar por categoría, buscar productos específicos y agregar todo a tu carrito de compras.</p>

<h3>🔧 Taller y Servicios</h3>
<p>Además de la venta de componentes, ofrecemos servicios de mantenimiento, reparación y personalización de bicicletas. Visítanos en nuestro taller en Bollenar o contáctanos para agendar una hora.</p>

<h3>📦 Envíos a Todo Chile por Starken</h3>
<p>Despachamos tus pedidos a todo el país a través de Starken. Conoce los tiempos de entrega y costos según tu ubicación en nuestra sección de preguntas frecuentes.</p>

<h3>💳 Múltiples Métodos de Pago</h3>
<p>Aceptamos tarjetas de débito y crédito a través de MercadoPago, transferencias bancarias y depósitos directos. Todo con la máxima seguridad.</p>

<h3>📱 Carrito Persistente</h3>
<p>¿Encontraste algo que te gusta pero no quieres comprarlo ahora? No hay problema. Tu carrito se guarda automáticamente para que puedas retomar tu compra cuando quieras.</p>

<h2>¿Qué viene pronto?</h2>
<p>Estamos trabajando en nuevas funcionalidades como seguimiento de pedidos en tiempo real, reseñas de productos y un programa de fidelización para clientes frecuentes. ¡Mantente atento!</p>

<p>Te invitamos a explorar el sitio, conocer nuestros productos y servicios, y ser parte de la comunidad Rothar. Si tienes dudas, no dudes en contactarnos a través de nuestro formulario de contacto o directamente por WhatsApp.</p>

<p><strong>Rothar Workshop</strong> — Pasión por la mecánica y el ciclismo. 🚲</p>`,
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
    const existing = await prisma.post.findUnique({ where: { slug: post.slug } })
    if (!existing) await prisma.post.create({ data: post })
  }
  console.log('Default blog posts created')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
