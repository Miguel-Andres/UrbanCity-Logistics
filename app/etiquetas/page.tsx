/**
 * Página principal del generador de etiquetas - Server Component como dashboard
 */
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/app/components/Navbar'
import EtiquetasClient from './EtiquetasClient'

export default async function EtiquetasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Si no está autenticado, redirigir a /access (igual que dashboard)
  if (!user) {
    redirect('/access')
  }

  // Obtener profile del usuario en el servidor
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('store_name, phone')
    .eq('id', user.id)
    .single()

  // Log para debugging en servidor (aparecerá en logs de Vercel)
  console.log('🔍 [EtiquetasPage Server] Profile obtenido:', {
    user_id: user.id,
    profile: profile,
    error: profileError,
    store_name: profile?.store_name
  })

  return <EtiquetasClient user={user} profile={profile} />
}