'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getUserSettings() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: profile } = await supabase
        .from('profiles')
        .select(`
            *,
            companies (*)
        `)
        .eq('id', user.id)
        .single()

    return profile
}

export async function updateUserProfile(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const data = {
        first_name: formData.get('first_name') as string,
        last_name: formData.get('last_name') as string,
        phone: formData.get('phone') as string,
        avatar_url: formData.get('avatar_url') as string,
        updated_at: new Date().toISOString(),
    }

    const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id)

    if (error) {
        console.error('Error updating profile:', error)
        return { success: false, error: error.message }
    }

    // Audit Log
    await supabase.from('audit_logs').insert({
        company_id: (await supabase.from('profiles').select('company_id').eq('id', user.id).single()).data?.company_id,
        user_id: user.id,
        action: 'UPDATE_PROFILE',
        entity_type: 'PROFILE',
        entity_id: user.id,
        new_data: data
    })

    revalidatePath('/[locale]/[tenant]/settings', 'page')
    return { success: true }
}

export async function updateCompanySettings(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    // Get company ID from profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single()

    if (!profile?.company_id) return { success: false, error: 'No company found' }

    const data = {
        name: formData.get('name') as string,
        address: formData.get('address') as string,
        phone: formData.get('phone') as string,
        business_email: formData.get('business_email') as string,
        tax_id: formData.get('tax_id') as string,
        tax_rate: Number(formData.get('tax_rate')) || 0,
        primary_color: formData.get('primary_color') as string,
        secondary_color: formData.get('secondary_color') as string,
        logo_url: formData.get('logo_url') as string,
        updated_at: new Date().toISOString(),
    }

    const { error } = await supabase
        .from('companies')
        .update(data)
        .eq('id', profile.company_id)

    if (error) {
        console.error('Error updating company settings:', error)
        return { success: false, error: error.message }
    }

    // Audit Log
    await supabase.from('audit_logs').insert({
        company_id: profile.company_id,
        user_id: user.id,
        action: 'UPDATE_COMPANY',
        entity_type: 'COMPANY',
        entity_id: profile.company_id,
        new_data: data
    })

    revalidatePath('/[locale]/[tenant]', 'layout')
    return { success: true }
}

// Mantener por compatibilidad si es necesario, pero remapear a la nueva función
export async function updateCompanyBranding(formData: FormData) {
    return updateCompanySettings(formData)
}
