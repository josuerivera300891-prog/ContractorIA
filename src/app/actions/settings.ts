'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateCompanyBranding(formData: FormData) {
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
        primary_color: formData.get('primary_color') as string,
        secondary_color: formData.get('secondary_color') as string,
        accent_color: formData.get('accent_color') as string,
        logo_url: formData.get('logo_url') as string,
    }

    const { error } = await supabase
        .from('companies')
        .update(data)
        .eq('id', profile.company_id)

    if (error) {
        console.error('Error updating branding:', error)
        return { success: false, error: error.message }
    }

    revalidatePath('/[locale]/[tenant]', 'layout')
    return { success: true }
}
