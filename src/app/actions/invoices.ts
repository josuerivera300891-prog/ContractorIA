'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function convertEstimateToInvoiceAction(estimateId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    // 1. Fetch the estimate to ensure it can be converted
    const { data: estimate, error: estError } = await supabase
        .from('estimates')
        .select('*')
        .eq('id', estimateId)
        .single()

    if (estError || !estimate) {
        return { success: false, error: 'Presupuesto no encontrado.' }
    }

    if (estimate.status !== 'SIGNED') {
        return { success: false, error: 'Solo se pueden facturar presupuestos firmados.' }
    }

    // 2. Map Estimate data to Invoice
    const invoiceData = {
        company_id: estimate.company_id,
        estimate_id: estimate.id,
        invoice_number: estimate.estimate_number.replace('EST', 'INV'), // Simple conversion for now
        status: 'UNPAID',
        client_id: estimate.client_id,
        items: estimate.items,
        subtotal: estimate.subtotal,
        tax_amount: estimate.tax_amount,
        total: estimate.total,
        balance_due: estimate.total,
        due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days default
    }

    // 3. Insert Invoice
    const { data: invoice, error: invError } = await supabase
        .from('invoices')
        .insert(invoiceData)
        .select()
        .single()

    if (invError) {
        console.error('Error creating invoice:', invError)
        return { success: false, error: 'Error al generar la factura.' }
    }

    // 4. Audit Log
    await supabase.from('audit_logs').insert({
        company_id: estimate.company_id,
        actor_id: user.id,
        action: 'INVOICE_GENERATED',
        metadata: {
            estimate_id: estimateId,
            invoice_id: invoice.id,
            invoice_number: invoice.invoice_number
        }
    })

    revalidatePath('/[locale]/[tenant]/estimates')
    return { success: true, data: invoice }
}
/**
 * Fetches invoices for a company.
 */
export async function getInvoices(companyId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('invoices')
        .select(`
            *,
            clients (id, first_name, last_name, company_name)
        `)
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching invoices:', error)
        return []
    }
    return data
}

/**
 * Fetches a single invoice by ID with client details.
 */
export async function getInvoiceById(invoiceId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('invoices')
        .select(`
            *,
            clients (id, first_name, last_name, email, phone, company_name, address)
        `)
        .eq('id', invoiceId)
        .single()

    if (error) {
        console.error('Error fetching invoice:', error)
        return null
    }
    return data
}

export async function createInvoiceAction(formData: FormData, companyId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, error: 'No autorizado' }

    const rawData = {
        client_id: formData.get('clientId') as string,
        estimate_id: formData.get('estimateId') as string || null,
        invoice_number: `INV-${Date.now().toString().slice(-6)}`,
        status: 'DRAFT',
        subtotal: Number(formData.get('subtotal')),
        tax_rate: Number(formData.get('taxRate')),
        tax_amount: Number(formData.get('taxAmount')),
        total: Number(formData.get('total')),
        due_date: formData.get('dueDate') as string,
        notes: formData.get('notes') as string,
        company_id: companyId,
        items: JSON.parse(formData.get('items') as string || '[]')
    }

    const { data, error } = await supabase
        .from('invoices')
        .insert(rawData)
        .select()
        .single()

    if (error) {
        console.error('Error creating invoice:', error)
        return { success: false, error: error.message }
    }

    // Audit Log
    await supabase.from('audit_logs').insert({
        company_id: companyId,
        user_id: user.id,
        action: 'CREATE_INVOICE',
        entity_type: 'INVOICE',
        entity_id: data.id,
        new_data: data
    })

    return { success: true, data }
}
