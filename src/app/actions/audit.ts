'use server'

import { createClient } from '@/lib/supabase/server'

export async function getAuditLogs(companyId: string, limit = 50) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('audit_logs')
        .select(`
            id,
            action,
            metadata,
            created_at,
            actor:profiles!actor_id(full_name, email)
        `)
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })
        .limit(limit)

    if (error) {
        console.error('Error fetching audit logs:', error)
        return []
    }

    return data.map(log => ({
        ...log,
        actor: Array.isArray(log.actor) ? log.actor[0] : log.actor
    }))
}
