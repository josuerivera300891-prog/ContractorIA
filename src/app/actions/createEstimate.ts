'use server'

import { createClient } from '@/utils/supabase/server'
import { z } from 'zod'
import { calculateEstimateTotals, calculateLineItemTotal } from '@/lib/calculations'
import { revalidatePath } from 'next/cache'
import { EstimateStatus, UnitType } from '@/types/domain'

// Zod Schema for Validation
const LineItemSchema = z.object({
    description: z.string().min(1, 'Description is required'),
    unit_type: z.enum(['sqft', 'hour', 'day', 'unit', 'fixed'] as [string, ...string[]]),
    quantity: z.number().min(0),
    rate: z.number().min(0),
})

const CreateEstimateSchema = z.object({
    client_id: z.string().uuid(),
    items: z.array(LineItemSchema).min(1, 'At least one item is required'),
    tax_rate: z.number().min(0).max(100).default(0),
    notes: z.string().optional(),
})

export type CreateEstimateState = {
    success?: boolean
    error?: string
    fieldErrors?: {
        [K in keyof z.infer<typeof CreateEstimateSchema>]?: string[]
    }
}

export async function createEstimate(prevState: CreateEstimateState, formData: FormData): Promise<CreateEstimateState> {
    const supabase = await createClient()

    // 1. Auth Check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return { success: false, error: 'Unauthorized' }
    }

    // 2. Parse Input (Note: In a real form, we'd parse FormData. Here assuming specific structure or JSON)
    // For this example, we assume we receive raw data or parse it from formData entries
    // But typically Server Actions receive FormData directly.
    // To keep it strict, let's extract data from formData.

    const rawData = {
        client_id: formData.get('client_id'),
        items: JSON.parse(formData.get('items') as string || '[]'),
        tax_rate: Number(formData.get('tax_rate') || 0),
        notes: formData.get('notes'),
    }

    const validatedFields = CreateEstimateSchema.safeParse(rawData)

    if (!validatedFields.success) {
        return {
            success: false,
            error: 'Validation failed',
            fieldErrors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const { client_id, items, tax_rate, notes } = validatedFields.data

    // 3. Business Logic: Calculations
    // No price invention: strict calculation based on inputs.
    const processedItems = items.map(item => ({
        ...item,
        unit_type: item.unit_type as UnitType,
        total: calculateLineItemTotal(item.quantity, item.rate, item.unit_type as UnitType)
    }))

    const totals = calculateEstimateTotals(processedItems, tax_rate)

    try {
        // 4. DB Insert
        // We need the tenant_id (company_id). Typically stored in user metadata or a separate profile table.
        // For now, let's assume we fetch it or it's on the user.
        // STRICT RULE: Multi-tenancy must be enforced.

        // Fetch profile to get company_id
        const { data: profile } = await supabase
            .from('profiles')
            .select('company_id')
            .eq('id', user.id)
            .single()

        if (!profile?.company_id) {
            // Fallback for demo/dev if profile doesn't exist yet, or strict error
            return { success: false, error: 'User does not belong to a company (Tenant ID missing)' }
        }

        const { error: insertError } = await supabase
            .from('estimates')
            .insert({
                company_id: profile.company_id,
                client_id,
                created_by: user.id,
                status: 'DRAFT' as EstimateStatus,
                date_issued: new Date().toISOString(),
                items: processedItems, // Jsonb column
                subtotal: totals.subtotal,
                tax_amount: totals.taxAmount,
                total: totals.total,
                deposit_amount: 0,
                balance_due: totals.total,
                notes,
            })
            .select()
            .single()

        if (insertError) {
            console.error('Database Error:', insertError)
            return { success: false, error: 'Failed to create estimate' }
        }

        revalidatePath('/[tenant]/dashboard/estimates')
        return { success: true }

    } catch (error) {
        console.error('Server Action Error:', error)
        return { success: false, error: 'Internal Server Error' }
    }
}
