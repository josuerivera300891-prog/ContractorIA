// Email templates for ContractorIA

interface EstimateEmailData {
  clientName: string
  companyName: string
  estimateNumber: string
  total: number
  estimateId: string
}

interface InvoiceEmailData {
  clientName: string
  companyName: string
  invoiceNumber: string
  total: number
  balanceDue: number
  dueDate: string
  invoiceId: string
}

interface PaymentEmailData {
  clientName: string
  companyName: string
  invoiceNumber: string
  amountPaid: number
  paymentMethod: string
  transactionId: string
  remainingBalance: number
}

const baseStyles = `
  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }
  .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
  .header { background: linear-gradient(135deg, #0891B2 0%, #06b6d4 100%); padding: 32px; text-align: center; }
  .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; }
  .header p { color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px; }
  .content { padding: 32px; }
  .greeting { font-size: 18px; color: #1f2937; margin-bottom: 16px; }
  .message { color: #4b5563; line-height: 1.6; margin-bottom: 24px; }
  .details-card { background-color: #f0fdfa; border-radius: 12px; padding: 24px; margin-bottom: 24px; }
  .details-card h3 { color: #0891B2; margin: 0 0 16px; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px; }
  .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #ccfbf1; }
  .detail-row:last-child { border-bottom: none; }
  .detail-label { color: #6b7280; font-size: 14px; }
  .detail-value { color: #1f2937; font-weight: 600; font-size: 14px; }
  .cta-button { display: inline-block; background: linear-gradient(135deg, #0891B2 0%, #06b6d4 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 16px 0; }
  .footer { background-color: #f9fafb; padding: 24px 32px; text-align: center; border-top: 1px solid #e5e7eb; }
  .footer p { color: #6b7280; font-size: 12px; margin: 4px 0; }
  .total-highlight { font-size: 24px; color: #0891B2; font-weight: 700; }
  .status-badge { display: inline-block; padding: 6px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; }
  .status-paid { background-color: #d1fae5; color: #065f46; }
  .status-pending { background-color: #fef3c7; color: #92400e; }
`

export function estimateSentEmail(data: EstimateEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nuevo Estimado - ${data.companyName}</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${data.companyName}</h1>
      <p>Has recibido un nuevo estimado</p>
    </div>
    <div class="content">
      <p class="greeting">Hola ${data.clientName},</p>
      <p class="message">
        Te hemos enviado un nuevo estimado para tu revisi&oacute;n y aprobaci&oacute;n.
        Por favor revisa los detalles a continuaci&oacute;n.
      </p>

      <div class="details-card">
        <h3>Detalles del Estimado</h3>
        <div class="detail-row">
          <span class="detail-label">N&uacute;mero de Estimado</span>
          <span class="detail-value">${data.estimateNumber}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Total</span>
          <span class="detail-value total-highlight">$${data.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      <div style="text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://contractoria.app'}/estimates/${data.estimateId}" class="cta-button">
          Ver Estimado
        </a>
      </div>

      <p class="message" style="margin-top: 24px; font-size: 14px;">
        Si tienes preguntas sobre este estimado, no dudes en contactarnos.
      </p>
    </div>
    <div class="footer">
      <p>Este correo fue enviado autom&aacute;ticamente por ${data.companyName}</p>
      <p>Powered by ContractorIA</p>
    </div>
  </div>
</body>
</html>
`
}

export function invoiceCreatedEmail(data: InvoiceEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nueva Factura - ${data.companyName}</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${data.companyName}</h1>
      <p>Has recibido una nueva factura</p>
    </div>
    <div class="content">
      <p class="greeting">Hola ${data.clientName},</p>
      <p class="message">
        Se ha generado una nueva factura a tu nombre.
        Por favor revisa los detalles y realiza el pago antes de la fecha de vencimiento.
      </p>

      <div class="details-card">
        <h3>Detalles de la Factura</h3>
        <div class="detail-row">
          <span class="detail-label">N&uacute;mero de Factura</span>
          <span class="detail-value">${data.invoiceNumber}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Total</span>
          <span class="detail-value">$${data.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Saldo Pendiente</span>
          <span class="detail-value total-highlight">$${data.balanceDue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Fecha de Vencimiento</span>
          <span class="detail-value" style="color: #dc2626;">${data.dueDate}</span>
        </div>
      </div>

      <div style="text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://contractoria.app'}/invoices/${data.invoiceId}/pay" class="cta-button">
          Pagar Ahora
        </a>
      </div>
    </div>
    <div class="footer">
      <p>Este correo fue enviado autom&aacute;ticamente por ${data.companyName}</p>
      <p>Powered by ContractorIA</p>
    </div>
  </div>
</body>
</html>
`
}

export function paymentReceivedEmail(data: PaymentEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pago Recibido - ${data.companyName}</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="container">
    <div class="header" style="background: linear-gradient(135deg, #059669 0%, #10b981 100%);">
      <h1>${data.companyName}</h1>
      <p>Hemos recibido tu pago</p>
    </div>
    <div class="content">
      <p class="greeting">Hola ${data.clientName},</p>

      <div style="text-align: center; margin-bottom: 24px;">
        <span class="status-badge status-paid">Pago Confirmado</span>
      </div>

      <p class="message">
        Gracias por tu pago. A continuaci&oacute;n encontrar&aacute;s los detalles de la transacci&oacute;n.
      </p>

      <div class="details-card" style="background-color: #ecfdf5;">
        <h3 style="color: #059669;">Detalles del Pago</h3>
        <div class="detail-row" style="border-color: #a7f3d0;">
          <span class="detail-label">Factura</span>
          <span class="detail-value">${data.invoiceNumber}</span>
        </div>
        <div class="detail-row" style="border-color: #a7f3d0;">
          <span class="detail-label">Monto Pagado</span>
          <span class="detail-value" style="color: #059669; font-size: 18px;">$${data.amountPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
        <div class="detail-row" style="border-color: #a7f3d0;">
          <span class="detail-label">M&eacute;todo de Pago</span>
          <span class="detail-value">${data.paymentMethod}</span>
        </div>
        <div class="detail-row" style="border-color: #a7f3d0;">
          <span class="detail-label">ID de Transacci&oacute;n</span>
          <span class="detail-value" style="font-family: monospace;">${data.transactionId}</span>
        </div>
        ${data.remainingBalance > 0 ? `
        <div class="detail-row" style="border-color: #a7f3d0;">
          <span class="detail-label">Saldo Restante</span>
          <span class="detail-value" style="color: #f59e0b;">$${data.remainingBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
        ` : ''}
      </div>

      <p class="message" style="font-size: 14px;">
        Este recibo sirve como confirmaci&oacute;n de tu pago. Guarda este correo para tus registros.
      </p>
    </div>
    <div class="footer">
      <p>Este correo fue enviado autom&aacute;ticamente por ${data.companyName}</p>
      <p>Powered by ContractorIA</p>
    </div>
  </div>
</body>
</html>
`
}

export function paymentReminderEmail(data: InvoiceEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recordatorio de Pago - ${data.companyName}</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="container">
    <div class="header" style="background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);">
      <h1>${data.companyName}</h1>
      <p>Recordatorio de Pago Pendiente</p>
    </div>
    <div class="content">
      <p class="greeting">Hola ${data.clientName},</p>

      <div style="text-align: center; margin-bottom: 24px;">
        <span class="status-badge status-pending">Pago Pendiente</span>
      </div>

      <p class="message">
        Te recordamos que tienes una factura pendiente de pago.
        Por favor realiza el pago lo antes posible para evitar recargos.
      </p>

      <div class="details-card" style="background-color: #fffbeb;">
        <h3 style="color: #f59e0b;">Detalles de la Factura</h3>
        <div class="detail-row" style="border-color: #fde68a;">
          <span class="detail-label">N&uacute;mero de Factura</span>
          <span class="detail-value">${data.invoiceNumber}</span>
        </div>
        <div class="detail-row" style="border-color: #fde68a;">
          <span class="detail-label">Saldo Pendiente</span>
          <span class="detail-value total-highlight" style="color: #f59e0b;">$${data.balanceDue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
        <div class="detail-row" style="border-color: #fde68a;">
          <span class="detail-label">Fecha de Vencimiento</span>
          <span class="detail-value" style="color: #dc2626;">${data.dueDate}</span>
        </div>
      </div>

      <div style="text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://contractoria.app'}/invoices/${data.invoiceId}/pay" class="cta-button" style="background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);">
          Pagar Ahora
        </a>
      </div>
    </div>
    <div class="footer">
      <p>Este correo fue enviado autom&aacute;ticamente por ${data.companyName}</p>
      <p>Powered by ContractorIA</p>
    </div>
  </div>
</body>
</html>
`
}
