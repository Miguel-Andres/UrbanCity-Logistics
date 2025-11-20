'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Profile, ProfileFormData } from '@/lib/types/profile'

export async function getProfile(): Promise<Profile | null> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return null
    }

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (error) {
        // Si no existe el perfil, retornar null (se creará después)
        if (error.code === 'PGRST116') {
            return null
        }
        console.error('Error fetching profile:', error)
        return null
    }

    return data
}

export async function upsertProfile(formData: ProfileFormData): Promise<{
    success: boolean
    error?: string
}> {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return { success: false, error: 'No autenticado' }
        }

        // Validación
        if (formData.phone && !/^\+?[\d\s\-()]+$/.test(formData.phone)) {
            return { success: false, error: 'Número de teléfono inválido' }
        }

        if (formData.store_name && formData.store_name.length > 100) {
            return { success: false, error: 'Nombre de tienda muy largo (máx. 100 caracteres)' }
        }

        // Upsert (insert or update)
        const { error } = await supabase
            .from('profiles')
            .upsert({
                id: user.id,
                phone: formData.phone || null,
                store_name: formData.store_name || null,
            }, {
                onConflict: 'id'
            })

        if (error) {
            console.error('Error upserting profile:', error)
            return { success: false, error: 'Error al guardar el perfil' }
        }

        revalidatePath('/profile')
        revalidatePath('/dashboard')

        return { success: true }
    } catch (error) {
        console.error('Unexpected error:', error)
        return { success: false, error: 'Error inesperado' }
    }
}
