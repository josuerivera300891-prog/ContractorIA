/**
 * Mail Utility for ContractorIA using Resend API.
 * Uses fetch to avoid extra dependency overhead.
 */
export async function sendEmail({ to, subject, html }: { to: string, subject: string, html: string }) {
    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    if (!RESEND_API_KEY) {
        console.warn('RESEND_API_KEY is missing. Email skipped. Content:', { to, subject });
        return { success: false, error: 'Configuración de correo faltante.' };
    }

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: 'ContractorIA <notifications@contractoria.ai>',
                to,
                subject,
                html,
            }),
        });

        if (response.ok) {
            return { success: true };
        } else {
            const error = await response.json();
            console.error('Resend API Error:', error);
            return { success: false, error: error.message };
        }
    } catch (err) {
        console.error('Mail sending failed:', err);
        return { success: false, error: 'Error al enviar el correo.' };
    }
}

/**
 * Template for Estimate Invitation
 */
export function getEstimateEmailTemplate(companyName: string, estimateNumber: string, signUrl: string) {
    return `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #f0f0f0; border-radius: 24px;">
            <h1 style="color: #1e3a8a; font-size: 24px;">Presupuesto de ${companyName}</h1>
            <p style="color: #64748b; line-height: 1.6;">Has recibido un nuevo presupuesto profesional (#${estimateNumber}). Por favor, revísalo y fírmalo digitalmente para proceder con los servicios.</p>
            <div style="margin: 40px 0;">
                <a href="${signUrl}" style="background: #06b6d4; color: white; padding: 16px 32px; border-radius: 16px; text-decoration: none; font-weight: bold; display: inline-block;">Ver y Firmar Presupuesto</a>
            </div>
            <p style="font-size: 12px; color: #94a3b8;">Este documento es gestionado de forma segura por ContractorIA.</p>
        </div>
    `;
}
