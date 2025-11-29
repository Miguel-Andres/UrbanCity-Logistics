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

  return <EtiquetasClient user={user} />
}