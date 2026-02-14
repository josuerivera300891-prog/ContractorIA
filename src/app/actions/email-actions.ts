'use server'

import { createClient } from '@/utils/supabase/server'
import { sendEmail, getEstimateEmailTemplate } from '@/lib/mail'

export async function sendEstimateEmailAction(estimateId: string, clientEmail: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    // Fetch estimate and company info
    const { data: estimate, error } = await supabase
        .from('estimates')
        .select(`
            id,
            estimate_number,
            companies (name, slug)
        `)
        .eq('id', estimateId)
        .single()

    if (error || !estimate) return { success: false, error: 'Presupuesto no encontrado.' }

    const company = estimate.companies as any;
    const signUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/es/sign/${estimate.id}`;

    const html = getEstimateEmailTemplate(company.name, estimate.estimate_number, signUrl);

    const result = await sendEmail({
        to: clientEmail,
        subject: `Presupuesto #${estimate.estimate_number} de ${company.name}`,
        html
    });

    if (result.success) {
        // Audit log
        await supabase.from('audit_logs').insert({
            company_id: (await supabase.from('profiles').select('company_id').eq('id', user.id).single()).data?.company_id,
            actor_id: user.id,
            action: 'ESTIMATE_SENT_EMAIL',
            metadata: { estimate_id: estimateId, recipient: clientEmail }
        });
    }

    return result;
}
