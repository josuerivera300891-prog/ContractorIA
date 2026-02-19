'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'

export async function signEstimateAction(formData: FormData) {
    const supabase = await createClient()

    // 1. Extract and Validate
    const estimateId = formData.get('estimate_id') as string
    const signerName = formData.get('signer_name') as string
    const signerEmail = formData.get('signer_email') as string
    const signatureData = formData.get('signature_data') as string // Base64

    if (!estimateId || !signerName || !signerEmail || !signatureData) {
        return { success: false, error: 'Todos los campos son obligatorios.' }
    }

    // Capture metadata
    const heads = await headers()
    const ip = heads.get('x-forwarded-for') || heads.get('remote-addr')
    const userAgent = heads.get('user-agent')

    // 2. Fetch Estimate to ensure it exists and belongs to a company
    const { data: estimate, error: estError } = await supabase
        .from('estimates')
        .select('company_id, status, estimate_number')
        .eq('id', estimateId)
        .single()

    if (estError || !estimate) {
        return { success: false, error: 'Presupuesto no encontrado.' }
    }

    if (estimate.status === 'SIGNED') {
        return { success: false, error: 'Este presupuesto ya ha sido firmado.' }
    }

    // 3. Register Signature
    const { data: signature, error: sigError } = await supabase
        .from('signatures')
        .insert({
            estimate_id: estimateId,
            company_id: estimate.company_id,
            signer_name: signerName,
            signer_email: signerEmail,
            signature_data: signatureData,
            ip_address: ip,
            user_agent: userAgent,
            document_hash: btoa(`${estimateId}-${Date.now()}`) // Simple mock hash for now
        })
        .select()
        .single()

    if (sigError) {
        console.error('Error recording signature:', sigError)
        return { success: false, error: 'Error al registrar la firma.' }
    }

    // 4. Update Estimate Status and link signature
    const { error: updError } = await supabase
        .from('estimates')
        .update({
            status: 'SIGNED',
            signature_id: signature.id,
            updated_at: new Date().toISOString()
        })
        .eq('id', estimateId)

    if (updError) {
        return { success: false, error: 'Error al actualizar el estado del presupuesto.' }
    }

    // 5. Audit Log
    await supabase.from('audit_logs').insert({
        company_id: estimate.company_id,
        actor_id: (await supabase.auth.getUser()).data.user?.id || estimateId, // fallback for public sign
        action: 'ESTIMATE_SIGNED',
        metadata: {
            estimate_id: estimateId,
            estimate_number: estimate.estimate_number,
            signer: signerName
        }
    })

    revalidatePath('/[locale]/sign/[id]', 'page')
    return { success: true }
}
