'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Creates a new client for a specific company.
 * Enforces strict multi-tenancy and returns a standardized response.
 */
export async function createClientAction(formData: FormData, companyId: string) {
    const supabase = await createClient()

    // Auth validation
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return { success: false, error: 'Unauthorized access' }
    }

    const data = {
        company_id: companyId,
        first_name: formData.get('firstName') as string,
        last_name: formData.get('lastName') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        company_name: formData.get('companyName') as string,
        address: formData.get('address') as string,
        notes: formData.get('notes') as string,
        status: 'ACTIVE'
    }

    const { data: insertedData, error } = await supabase
        .from('clients')
        .insert([data])
        .select()
        .single()

    if (error) {
        console.error('Error creating client:', error)
        return { success: false, error: error.message }
    }

    // Log the action (Audit Log)
    await supabase.from('audit_logs').insert({
        company_id: companyId,
        actor_id: user.id,
        action: 'CLIENT_CREATED',
        metadata: { client_id: insertedData?.id }
    })

    revalidatePath('/[locale]/[tenant]/clients', 'page')
    return { success: true, data: insertedData }
}

/**
 * Fetches all clients for a company.
 */
export async function getClients(companyId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching clients:', error)
        return []
    }

    return data
}
/**
 * Fetches a single client by ID.
 */
export async function getClientById(clientId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .single()

    if (error) {
        console.error('Error fetching client:', error)
        return null
    }
    return data
}

/**
 * Updates an existing client.
 */
export async function updateClientAction(clientId: string, formData: FormData, companyId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const data = {
        first_name: formData.get('firstName') as string,
        last_name: formData.get('lastName') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        company_name: formData.get('companyName') as string,
        address: formData.get('address') as string,
        notes: formData.get('notes') as string,
    }

    const { error } = await supabase
        .from('clients')
        .update(data)
        .eq('id', clientId)
        .eq('company_id', companyId)

    if (error) return { success: false, error: error.message }

    // Audit Log
    await supabase.from('audit_logs').insert({
        company_id: companyId,
        actor_id: user.id,
        action: 'CLIENT_UPDATED',
        metadata: { client_id: clientId }
    })

    revalidatePath('/[locale]/[tenant]/clients', 'page')
    revalidatePath(`/[locale]/[tenant]/clients/${clientId}`, 'page')
    return { success: true }
}

/**
 * Deletes a client.
 */
export async function deleteClientAction(clientId: string, companyId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId)
        .eq('company_id', companyId)

    if (error) return { success: false, error: error.message }

    // Audit Log
    await supabase.from('audit_logs').insert({
        company_id: companyId,
        actor_id: user.id,
        action: 'CLIENT_DELETED',
        metadata: { client_id: clientId }
    })

    revalidatePath('/[locale]/[tenant]/clients', 'page')
    return { success: true }
}
