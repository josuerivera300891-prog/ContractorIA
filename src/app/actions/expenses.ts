'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const ExpenseSchema = z.object({
    estimate_id: z.string().uuid().optional().nullable(),
    category: z.enum(['Material', 'Labor', 'Equipment', 'Subcontractor', 'Other']),
    description: z.string().min(1, 'La descripción es requerida'),
    amount: z.number().min(0, 'El monto debe ser positivo'),
    expense_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida'),
})

export async function createExpenseAction(formData: FormData, companyId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'No autorizado' }

    const rawData = {
        estimate_id: formData.get('estimate_id') || null,
        category: formData.get('category'),
        description: formData.get('description'),
        amount: Number(formData.get('amount')),
        expense_date: formData.get('expense_date'),
    }

    const validated = ExpenseSchema.safeParse(rawData)
    if (!validated.success) return { success: false, error: 'Datos inválidos' }

    const { error } = await supabase
        .from('expenses')
        .insert({
            ...validated.data,
            company_id: companyId,
        })

    if (error) return { success: false, error: error.message }

    // Audit Log
    await supabase.from('audit_logs').insert({
        company_id: companyId,
        actor_id: user.id,
        action: 'EXPENSE_CREATED',
        metadata: {
            category: validated.data.category,
            amount: validated.data.amount,
            estimate_id: validated.data.estimate_id
        }
    })

    revalidatePath('/[locale]/[tenant]/dashboard', 'layout')
    return { success: true }
}

export async function deleteExpenseAction(id: string, companyId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'No autorizado' }

    const { error } = await supabase.from('expenses').delete().eq('id', id).eq('company_id', companyId)
    if (error) return { success: false, error: error.message }

    // Audit Log
    await supabase.from('audit_logs').insert({
        company_id: companyId,
        actor_id: user.id,
        action: 'EXPENSE_DELETED',
        metadata: { expense_id: id }
    })

    revalidatePath('/[locale]/[tenant]/dashboard', 'layout')
    return { success: true }
}

export async function getProjectProfitability(estimateId: string) {
    const supabase = await createClient()

    // 1. Get estimate revenue
    const { data: estimate } = await supabase
        .from('estimates')
        .select('total, subtotal')
        .eq('id', estimateId)
        .single()

    // 2. Get total expenses for this project
    const { data: expenses } = await supabase
        .from('expenses')
        .select('amount, category')
        .eq('estimate_id', estimateId)

    const revenue = estimate?.total || 0
    const totalExpenses = (expenses || []).reduce((acc, exp) => acc + Number(exp.amount), 0)
    const margin = revenue - totalExpenses
    const marginPercent = revenue > 0 ? (margin / revenue) * 100 : 0

    return {
        revenue,
        totalExpenses,
        margin,
        marginPercent,
        expenses: expenses || []
    }
}

/**
 * Updates an expense.
 */
export async function updateExpenseAction(expenseId: string, formData: FormData, companyId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const rawData = {
        estimate_id: formData.get('estimate_id') || null,
        category: formData.get('category'),
        description: formData.get('description'),
        amount: Number(formData.get('amount')),
        expense_date: formData.get('expense_date'),
    }

    const validated = ExpenseSchema.safeParse(rawData)
    if (!validated.success) return { success: false, error: 'Datos inválidos' }

    const { error } = await supabase
        .from('expenses')
        .update({
            ...validated.data,
            company_id: companyId,
        })
        .eq('id', expenseId)
        .eq('company_id', companyId)

    if (error) return { success: false, error: error.message }

    // Audit Log
    await supabase.from('audit_logs').insert({
        company_id: companyId,
        actor_id: user.id,
        action: 'EXPENSE_UPDATED',
        metadata: { expense_id: expenseId }
    })

    revalidatePath('/[locale]/[tenant]/dashboard', 'layout')
    return { success: true }
}

export async function getExpensesAction(companyId: string, estimateId?: string) {
    const supabase = await createClient()

    let query = supabase
        .from('expenses')
        .select(`
            *,
            estimates (
                title
            )
        `)
        .eq('company_id', companyId)
        .order('expense_date', { ascending: false })

    if (estimateId) {
        query = query.eq('estimate_id', estimateId)
    }

    const { data, error } = await query

    if (error) {
        console.error('Error fetching expenses:', error)
        return []
    }

    return data
}
