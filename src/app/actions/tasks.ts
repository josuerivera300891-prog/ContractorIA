'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const TaskSchema = z.object({
    project_id: z.string().uuid(),
    title: z.string().min(1, 'El título es requerido'),
    description: z.string().optional(),
    due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida').optional().nullable(),
    status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).default('TODO'),
})

export async function createProjectTaskAction(formData: FormData, companyId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'No autorizado' }

    const rawData = {
        project_id: formData.get('project_id'),
        title: formData.get('title'),
        description: formData.get('description') || '',
        due_date: formData.get('due_date') || null,
        status: 'TODO',
    }

    const validated = TaskSchema.safeParse(rawData)
    if (!validated.success) return { success: false, error: 'Datos inválidos' }

    const { error } = await supabase
        .from('project_tasks')
        .insert({
            ...validated.data,
            company_id: companyId,
        })

    if (error) return { success: false, error: error.message }

    // Audit Log
    await supabase.from('audit_logs').insert({
        company_id: companyId,
        actor_id: user.id,
        action: 'PROJECT_TASK_CREATED',
        metadata: { project_id: validated.data.project_id, title: validated.data.title }
    })

    revalidatePath('/[locale]/[tenant]/projects/[id]', 'page')
    return { success: true }
}

export async function updateTaskStatusAction(taskId: string, status: 'TODO' | 'IN_PROGRESS' | 'DONE', projectId: string, companyId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'No autorizado' }

    const { error } = await supabase
        .from('project_tasks')
        .update({ status })
        .eq('id', taskId)
        .eq('company_id', companyId)

    if (error) return { success: false, error: error.message }

    // Audit Log
    await supabase.from('audit_logs').insert({
        company_id: companyId,
        actor_id: user.id,
        action: 'PROJECT_TASK_UPDATED',
        metadata: { task_id: taskId, new_status: status }
    })

    revalidatePath('/[locale]/[tenant]/projects/[id]', 'page')
    return { success: true }
}

export async function getProjectTasks(projectId: string, companyId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('project_tasks')
        .select('*')
        .eq('project_id', projectId)
        .eq('company_id', companyId)
        .order('created_at', { ascending: true })

    if (error) {
        console.error('Error fetching tasks:', error)
        return []
    }

    return data
}
