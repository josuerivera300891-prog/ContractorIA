'use server'

import { createClient } from '@/utils/supabase/server'
import { z } from 'zod'
import { calculateEstimateTotals, calculateLineItemTotal } from '@/lib/calculations'
import { revalidatePath } from 'next/cache'
import { EstimateStatus, UnitType } from '@/types/domain'

// Validation Schemas
const LineItemSchema = z.object({
    description: z.string().min(1, 'Description is required'),
    unit_type: z.enum(['sqft', 'hour', 'day', 'unit', 'fixed'] as [string, ...string[]]),
    quantity: z.number().min(0).default(1),
    rate: z.number().min(0),
})

const EstimateSchema = z.object({
    client_id: z.string().uuid(),
    items: z.array(LineItemSchema).min(1, 'At least one item is required'),
    tax_rate: z.number().min(0).max(100).default(0),
    notes: z.string().optional(),
    deposit_type: z.enum(['PERCENT', 'FIXED', 'NONE']).default('NONE'),
    deposit_value: z.number().min(0).default(0),
})

export type EstimateActionState = {
    success?: boolean
    data?: any
    error?: string
}

/**
 * Creates a NEW estimate version 1.
 */
export async function createEstimateAction(formData: FormData, companyId: string): Promise<EstimateActionState> {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const rawData = {
        client_id: formData.get('client_id'),
        items: JSON.parse(formData.get('items') as string || '[]'),
        tax_rate: Number(formData.get('tax_rate') || 0),
        notes: formData.get('notes'),
        deposit_type: formData.get('deposit_type') || 'NONE',
        deposit_value: Number(formData.get('deposit_value') || 0),
    }

    const validated = EstimateSchema.safeParse(rawData)
    if (!validated.success) return { success: false, error: 'Validation failed' }

    const { items, tax_rate, deposit_type, deposit_value } = validated.data

    // Calculations with deterministic rounding
    const processedItems = items.map(item => ({
        ...item,
        total: calculateLineItemTotal(item.quantity, item.rate, item.unit_type as UnitType)
    }))

    const totals = calculateEstimateTotals(processedItems, tax_rate)

    // Deposit calculation
    let depositAmount = 0
    if (deposit_type === 'PERCENT') {
        depositAmount = Number((totals.total * (deposit_value / 100)).toFixed(2))
    } else if (deposit_type === 'FIXED') {
        depositAmount = Number(deposit_value.toFixed(2))
    }

    const balanceDue = Number((totals.total - depositAmount).toFixed(2))

    // Generate unique Number (EST-UUID part)
    const estimateNumber = `EST-${Math.random().toString(36).substring(7).toUpperCase()}`

    const { data: estimate, error } = await supabase
        .from('estimates')
        .insert({
            company_id: companyId,
            client_id: validated.data.client_id,
            created_by: user.id,
            estimate_number: estimateNumber,
            version: 1,
            status: 'DRAFT',
            items: processedItems,
            subtotal: totals.subtotal,
            tax_rate: tax_rate,
            tax_amount: totals.taxAmount,
            total: totals.total,
            deposit_type,
            deposit_value,
            deposit_amount: depositAmount,
            balance_due: balanceDue,
            notes: validated.data.notes,
        })
        .select()
        .single()

    if (error) return { success: false, error: error.message }

    // Audit Log
    await supabase.from('audit_logs').insert({
        company_id: companyId,
        actor_id: user.id,
        action: 'ESTIMATE_CREATED',
        metadata: { estimate_id: estimate.id, number: estimateNumber }
    })

    revalidatePath('/[locale]/[tenant]/dashboard', 'layout')
    return { success: true, data: estimate }
}

/**
 * Creates a NEW REVISION (Version N+1) from an existing estimate.
 */
export async function createRevisionAction(estimateId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    // Fetch parent estimate
    const { data: parent, error: fetchError } = await supabase
        .from('estimates')
        .select('*')
        .eq('id', estimateId)
        .single()

    if (fetchError || !parent) return { success: false, error: 'Parent estimate not found' }

    // Create new version
    const { data: revision, error: insError } = await supabase
        .from('estimates')
        .insert({
            ...parent,
            id: undefined, // Let Supabase generate new UUID
            version: parent.version + 1,
            parent_estimate_id: parent.id,
            status: 'DRAFT',
            created_at: undefined,
            updated_at: undefined,
            created_by: user.id
        })
        .select()
        .single()

    if (insError) return { success: false, error: insError.message }

    // Audit Log
    await supabase.from('audit_logs').insert({
        company_id: parent.company_id,
        actor_id: user.id,
        action: 'REVISION_CREATED',
        metadata: { estimate_id: revision.id, parent_id: parent.id, version: revision.version }
    })

    return { success: true, data: revision }
}

/**
 * Fetches estimates for a company.
 */
export async function getEstimates(companyId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('estimates')
        .select(`
            *,
            clients (id, first_name, last_name, company_name)
        `)
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching estimates:', error)
        return []
    }
    return data
}
/**
 * Fetches a single estimate by ID with client details.
 */
export async function getEstimateById(estimateId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('estimates')
        .select(`
            *,
            clients (id, first_name, last_name, email, phone, company_name, address)
        `)
        .eq('id', estimateId)
        .single()

    if (error) {
        console.error('Error fetching estimate:', error)
        return null
    }
    return data
}
/**
 * Updates estimate status or notes.
 */
export async function updateEstimateAction(estimateId: string, companyId: string, data: any) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const { error } = await supabase
        .from('estimates')
        .update(data)
        .eq('id', estimateId)
        .eq('company_id', companyId)

    if (error) return { success: false, error: error.message }

    // Audit Log
    await supabase.from('audit_logs').insert({
        company_id: companyId,
        actor_id: user.id,
        action: 'ESTIMATE_UPDATED',
        metadata: { estimate_id: estimateId, changes: data }
    })

    revalidatePath('/[locale]/[tenant]/estimates', 'page')
    revalidatePath(`/[locale]/[tenant]/estimates/${estimateId}`, 'page')
    return { success: true }
}

/**
 * Deletes an estimate.
 */
export async function deleteEstimateAction(estimateId: string, companyId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const { error } = await supabase
        .from('estimates')
        .delete()
        .eq('id', estimateId)
        .eq('company_id', companyId)

    if (error) return { success: false, error: error.message }

    // Audit Log
    await supabase.from('audit_logs').insert({
        company_id: companyId,
        actor_id: user.id,
        action: 'ESTIMATE_DELETED',
        metadata: { estimate_id: estimateId }
    })

    revalidatePath('/[locale]/[tenant]/estimates', 'page')
    return { success: true }
}
