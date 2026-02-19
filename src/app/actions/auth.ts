'use server'

import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'


// Validation Schema
const SignupSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    companyName: z.string().min(1, 'Company name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type SignupState = {
    success?: boolean
    error?: string
    fieldErrors?: {
        [K in keyof z.infer<typeof SignupSchema>]?: string[]
    }
}

// Overload to support both useActionState (prevState, formData) and direct call (formData)
export async function signup(prevStateOrFormData: SignupState | FormData, formData?: FormData): Promise<SignupState> {
    const supabase = await createClient()

    // Determine which argument is the actual FormData
    const actualFormData = formData || (prevStateOrFormData instanceof FormData ? prevStateOrFormData : null)
    if (!actualFormData) {
        return { success: false, error: 'Invalid form data' }
    }

    const rawData = {
        firstName: actualFormData.get('firstName'),
        lastName: actualFormData.get('lastName'),
        companyName: actualFormData.get('companyName'),
        email: actualFormData.get('email'),
        password: actualFormData.get('password'),
    }

    const validatedFields = SignupSchema.safeParse(rawData)

    if (!validatedFields.success) {
        return {
            success: false,
            error: 'Validation failed',
            fieldErrors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const { firstName, lastName, companyName, email, password } = validatedFields.data

    try {
        // 0. Check if user is already authenticated (but missing profile)
        const { data: { user: currentUser } } = await supabase.auth.getUser()

        let userId: string | undefined = currentUser?.id

        if (!userId) {
            // 1. Sign up the user if not authenticated
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        first_name: firstName,
                        last_name: lastName,
                    },
                },
            })

            if (authError) {
                // Check if user already registered but not logged in
                if (authError.message.includes('User already registered') || authError.status === 422) {
                    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                        email,
                        password,
                    })

                    if (signInError) {
                        console.error('Signup Re-auth Error:', signInError)
                        return { success: false, error: 'La cuenta ya existe. Por favor, inicia sesión o verifica tu contraseña.' }
                    }
                    userId = signInData.user.id
                } else {
                    console.error('Signup Auth Error:', authError)
                    return { success: false, error: authError.message }
                }
            } else {
                userId = authData.user?.id
            }
        }

        if (!userId) {
            return { success: false, error: 'No se pudo identificar al usuario' }
        }

        // 2 & 3. Create Company and Profile via RPC (SECURITY DEFINER)
        // We call this even if the user existed, the primary reason for failure 
        // in the previous step was missing profile data.
        const slug = companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000)

        const { error: rpcError } = await supabase.rpc('create_new_tenant', {
            p_first_name: firstName,
            p_last_name: lastName,
            p_company_name: companyName,
            p_slug: slug,
            p_user_id: userId
        })

        // If RPC fails, check if it's because it already exists (which is fine)
        if (rpcError) {
            // If the error is about duplicate keys, it means the profile/company is already setup
            if (rpcError.message.includes('duplicate key') || rpcError.code === '23505') {
                return { success: true }
            }
            console.error('Signup Data Error (RPC):', rpcError)
            return { success: false, error: 'Error al configurar el espacio de trabajo' }
        }

        return { success: true }

    } catch (error) {
        console.error('Signup Action Error:', error)
        return { success: false, error: 'Error interno del servidor' }
    }
}

export type AuthResult = {
    success?: boolean
    error?: string
}

export async function login(formData: FormData): Promise<AuthResult> {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
        return { success: false, error: 'Email and password are required' }
    }

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { success: false, error: error.message }
    }

    return { success: true }
}

export async function resetPassword(formData: FormData): Promise<AuthResult> {
    const supabase = await createClient()

    const email = formData.get('email') as string

    if (!email) {
        return { success: false, error: 'Email is required' }
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/update-password`,
    })

    if (error) {
        return { success: false, error: error.message }
    }

    return { success: true }
}

export async function updatePassword(formData: FormData): Promise<AuthResult> {
    const supabase = await createClient()

    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (!password || password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters' }
    }

    if (password !== confirmPassword) {
        return { success: false, error: 'Passwords do not match' }
    }

    const { error } = await supabase.auth.updateUser({
        password,
    })

    if (error) {
        return { success: false, error: error.message }
    }

    return { success: true }
}

export async function getUserProfile() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data: profile } = await supabase
        .from('profiles')
        .select(`
            role,
            company_id,
            companies (
                slug
            )
        `)
        .eq('id', user.id)
        .single()

    return {
        user,
        role: profile?.role || 'staff',
        companyId: profile?.company_id || null,
        companySlug: (profile?.companies as any)?.slug || null
    }
}
