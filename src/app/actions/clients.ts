'use server'

import { createClient } from '@/lib/supabase/server'
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

// =====================================================
// CRM: Estadísticas y datos del cliente
// =====================================================

/**
 * Obtiene estadísticas del cliente: total facturado, pagado, presupuestos, proyectos
 */
export async function getClientStats(clientId: string, companyId: string) {
    const supabase = await createClient()

    // Obtener facturas del cliente
    const { data: invoices } = await supabase
        .from('invoices')
        .select('total, amount_paid, status')
        .eq('client_id', clientId)
        .eq('company_id', companyId)

    // Contar presupuestos
    const { count: estimatesCount } = await supabase
        .from('estimates')
        .select('id', { count: 'exact', head: true })
        .eq('client_id', clientId)
        .eq('company_id', companyId)

    // Contar proyectos
    const { count: projectsCount } = await supabase
        .from('projects')
        .select('id', { count: 'exact', head: true })
        .eq('client_id', clientId)
        .eq('company_id', companyId)

    // Calcular totales
    const totalInvoiced = invoices?.reduce((sum, inv) => sum + Number(inv.total), 0) || 0
    const totalPaid = invoices?.reduce((sum, inv) => sum + Number(inv.amount_paid), 0) || 0
    const invoicesCount = invoices?.length || 0

    return {
        totalInvoiced,
        totalPaid,
        balanceDue: totalInvoiced - totalPaid,
        estimatesCount: estimatesCount || 0,
        projectsCount: projectsCount || 0,
        invoicesCount
    }
}

/**
 * Obtiene presupuestos del cliente
 */
export async function getClientEstimates(clientId: string, companyId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('estimates')
        .select('id, estimate_number, status, total, created_at')
        .eq('client_id', clientId)
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching client estimates:', error)
        return []
    }

    return data
}

/**
 * Obtiene facturas del cliente
 */
export async function getClientInvoices(clientId: string, companyId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('invoices')
        .select('id, invoice_number, status, total, balance_due, due_date, created_at')
        .eq('client_id', clientId)
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching client invoices:', error)
        return []
    }

    return data
}

/**
 * Obtiene proyectos del cliente
 */
export async function getClientProjects(clientId: string, companyId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('projects')
        .select('id, name, status, start_date, end_date, created_at')
        .eq('client_id', clientId)
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching client projects:', error)
        return []
    }

    return data
}

/**
 * Obtiene actividad reciente del cliente (audit logs + cambios de estado)
 */
export async function getClientActivity(clientId: string, companyId: string, limit = 20) {
    const supabase = await createClient()

    // Obtener audit logs relacionados con el cliente
    const { data: logs, error } = await supabase
        .from('audit_logs')
        .select('id, action, metadata, created_at')
        .eq('company_id', companyId)
        .or(`metadata->client_id.eq.${clientId},metadata->>client_id.eq.${clientId}`)
        .order('created_at', { ascending: false })
        .limit(limit)

    if (error) {
        console.error('Error fetching client activity:', error)
        return []
    }

    return logs || []
}
