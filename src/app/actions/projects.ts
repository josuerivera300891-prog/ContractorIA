'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createProjectAction(formData: FormData, companyId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const data = {
        company_id: companyId,
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        status: formData.get('status') as string || 'PLANNING',
        start_date: formData.get('startDate') as string || null,
        end_date: formData.get('endDate') as string || null,
        estimate_id: formData.get('estimate_id') as string || null,
    }

    const { data: project, error } = await supabase
        .from('projects')
        .insert([data])
        .select()
        .single()

    if (error) {
        console.error('Error creating project:', error)
        return { success: false, error: error.message }
    }

    // Audit Log
    await supabase.from('audit_logs').insert({
        company_id: companyId,
        actor_id: user.id,
        action: 'PROJECT_CREATED',
        metadata: { project_id: project.id, name: project.name }
    })

    revalidatePath('/[locale]/[tenant]/projects', 'page')
    return { success: true }
}

export async function getProjects(companyId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching projects:', error)
        return []
    }

    return data
}

export async function getProject(id: string, companyId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .eq('company_id', companyId)
        .single()

    if (error) {
        console.error('Error fetching project:', error)
        return null
    }

    return data
}
/**
 * Updates project details.
 */
export async function updateProjectAction(projectId: string, companyId: string, data: any) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const { error } = await supabase
        .from('projects')
        .update(data)
        .eq('id', projectId)
        .eq('company_id', companyId)

    if (error) return { success: false, error: error.message }

    // Audit Log
    await supabase.from('audit_logs').insert({
        company_id: companyId,
        actor_id: user.id,
        action: 'PROJECT_UPDATED',
        metadata: { project_id: projectId, changes: data }
    })

    revalidatePath('/[locale]/[tenant]/projects', 'page')
    return { success: true }
}

/**
 * Deletes a project.
 */
export async function deleteProjectAction(projectId: string, companyId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)
        .eq('company_id', companyId)

    if (error) return { success: false, error: error.message }

    // Audit Log
    await supabase.from('audit_logs').insert({
        company_id: companyId,
        actor_id: user.id,
        action: 'PROJECT_DELETED',
        metadata: { project_id: projectId }
    })

    revalidatePath('/[locale]/[tenant]/projects', 'page')
    return { success: true }
}
