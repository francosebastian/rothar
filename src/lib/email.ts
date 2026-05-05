import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface OrderEmailData {
  orderId: string
  customerName: string
  customerEmail: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  total: number
  shippingAddress: any
}

export async function sendOrderConfirmationEmail(orderData: OrderEmailData) {
  const { orderId, customerName, customerEmail, items, total, shippingAddress } = orderData

  const itemsHtml = items
    .map(
      (item) =>
        `<tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toLocaleString()}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.quantity).toLocaleString()}</td>
    </tr>`
    )
    .join('')

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">¡Gracias por tu compra, ${customerName}!</h1>
      <p style="color: #666;">Tu pedido #${orderId.slice(-8)} ha sido recibido y está siendo procesado.</p>
      
      <h2 style="color: #333; margin-top: 30px;">Detalles del Pedido</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f5f5f5;">
            <th style="padding: 8px; text-align: left;">Producto</th>
            <th style="padding: 8px; text-align: center;">Cantidad</th>
            <th style="padding: 8px; text-align: right;">Precio</th>
            <th style="padding: 8px; text-align: right;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" style="padding: 8px; text-align: right; font-weight: bold;">Total:</td>
            <td style="padding: 8px; text-align: right; font-weight: bold;">$${total.toLocaleString()}</td>
          </tr>
        </tfoot>
      </table>

      <h2 style="color: #333; margin-top: 30px;">Dirección de Envío</h2>
      <p style="color: #666;">
        ${shippingAddress.street}<br>
        ${shippingAddress.city}, ${shippingAddress.state || ''} ${shippingAddress.zipCode || ''}
      </p>

      <p style="color: #666; margin-top: 30px;">
        Te notificaremos cuando tu pedido sea enviado.
      </p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
      <p style="color: #999; font-size: 12px;">
        Rothar Workshop - Tu tienda de bicicletas de confianza
      </p>
    </div>
  `

  try {
    const data = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Rothar <onboarding@resend.dev>',
      to: customerEmail,
      subject: `Confirmación de Pedido #${orderId.slice(-8)} - Rothar`,
      html,
    })

    return { success: true, data }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error }
  }
}

export async function sendAdminOrderNotification(orderData: OrderEmailData) {
  const { orderId, customerName, customerEmail, items, total } = orderData

  const itemsList = items
    .map((item) => `- ${item.name} x${item.quantity} ($${item.price.toLocaleString()})`)
    .join('\n')

  try {
    const data = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Rothar <onboarding@resend.dev>',
      to: process.env.ADMIN_EMAIL || 'admin@rothar.com',
      subject: `Nuevo Pedido #${orderId.slice(-8)} - Rothar`,
      text: `
Nuevo pedido recibido:

Pedido: #${orderId.slice(-8)}
Cliente: ${customerName}
Email: ${customerEmail}
Total: $${total.toLocaleString()}

Productos:
${itemsList}

Revisa el panel de administración: ${process.env.NEXT_PUBLIC_BASE_URL}/admin/pedidos
      `,
    })

    return { success: true, data }
  } catch (error) {
    console.error('Error sending admin notification:', error)
    return { success: false, error }
  }
}
