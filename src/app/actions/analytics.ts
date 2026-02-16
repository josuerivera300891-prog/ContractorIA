'use server'

import { createClient } from '@/utils/supabase/server'
import { startOfMonth, endOfMonth, format, subMonths } from 'date-fns'

export async function getFinancialAnalytics() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single()

    const companyId = profile?.company_id
    if (!companyId) return null

    // Generar últimos 6 meses
    const last6Months = Array.from({ length: 6 }).map((_, i) => {
        const date = subMonths(new Date(), i)
        return {
            start: startOfMonth(date).toISOString(),
            end: endOfMonth(date).toISOString(),
            label: format(date, 'MMM'),
        }
    }).reverse()

    const chartData = []

    for (const month of last6Months) {
        // Ingresos (Estimaciones Firmadas)
        const { data: revenueData } = await supabase
            .from('estimates')
            .select('total_amount')
            .eq('company_id', companyId)
            .eq('status', 'SIGNED')
            .gte('created_at', month.start)
            .lte('created_at', month.end)

        const revenue = revenueData?.reduce((sum, item) => sum + (Number(item.total_amount) || 0), 0) || 0

        // Gastos
        const { data: expenseData } = await supabase
            .from('expenses')
            .select('amount')
            .eq('company_id', companyId)
            .gte('date', month.start)
            .lte('date', month.end)

        const expenses = expenseData?.reduce((sum, item) => sum + (Number(item.amount) || 0), 0) || 0

        chartData.push({
            name: month.label,
            ingresos: revenue,
            gastos: expenses,
            beneficio: revenue - expenses
        })
    }

    return chartData
}
