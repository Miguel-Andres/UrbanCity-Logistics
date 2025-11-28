import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/app/components/Navbar'
import { getProfile } from '@/app/profile/actions'
import StatsCard from '@/components/dashboard/StatsCard'
import SimpleTable from '@/components/dashboard/SimpleTable'
import UserProfileCard from '@/components/dashboard/UserProfileCard'

// Obtener datos del dashboard directamente de Supabase
async function getDashboardData() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  try {
    // Obtener todos los envíos del usuario
    const { data: shipments, error } = await supabase
      .from('shipments')
      .select(`
        id,
        tracking_code,
        status,
        created_at,
        delivered_at,
        payment_type,
        amount_to_charge,
        recipient_name,
        recipient_phone,
        recipient_address
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching shipments:', error)
      throw error
    }

    const today = new Date().toISOString().split('T')[0]
    
    // Calcular estadísticas
    const stats = {
      hoy_total: shipments?.filter(s => s.created_at.startsWith(today)).length || 0,
      pendientes: shipments?.filter(s => s.status === 'pending').length || 0,
      entregados_hoy: shipments?.filter(s => 
        s.status === 'delivered' && 
        s.delivered_at && 
        s.delivered_at.startsWith(today)
      ).length || 0,
      a_cobrar: shipments?.filter(s => 
        s.payment_type === 'COBRAR' && s.status !== 'delivered'
      ).reduce((sum, s) => sum + (s.amount_to_charge || 0), 0) || 0,
      total_envios: shipments?.length || 0
    }

    // Últimos 5 envíos
    const ultimos_envios = shipments?.slice(0, 5) || []

    return {
      stats,
      ultimos_envios
    }

  } catch (error) {
    console.error('Dashboard data error:', error)
    return {
      stats: {
        hoy_total: 0,
        pendientes: 0,
        entregados_hoy: 0,
        a_cobrar: 0,
        total_envios: 0
      },
      ultimos_envios: []
    }
  }
}

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Si no está autenticado, redirigir a /access
    if (!user) {
        redirect('/access')
    }

    // Obtener perfil del usuario y datos del dashboard
    const profile = await getProfile()
    const dashboardData = await getDashboardData() || {
        stats: {
            hoy_total: 0,
            pendientes: 0,
            entregados_hoy: 0,
            a_cobrar: 0,
            total_envios: 0
        },
        ultimos_envios: []
    }

    return (
        <div className="min-h-screen bg-slate-950 relative">
            {/* Background de líneas de tren sutil para toda la página */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900"></div>
                <div className="absolute inset-0 opacity-[0.04]">
                    <img src="/subway-lines.png" alt="" className="w-full h-full object-cover mix-blend-screen" />
                </div>
            </div>
            
            {/* Header */}
            <Navbar 
                user={user} 
                subtitle={`Bienvenido, ${user.user_metadata?.full_name || user.email?.split('@')[0]}!`}
            />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                  {/* Stats Grid */}
                  <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    <StatsCard
                        title="Envíos hoy"
                        value={dashboardData.stats.hoy_total}
                        icon="📦"
                        description="Generados hoy"
                    />
                    <StatsCard
                        title="Pendientes"
                        value={dashboardData.stats.pendientes}
                        icon="⏳"
                        description="Por entregar"
                    />
                    <StatsCard
                        title="Entregados hoy"
                        value={dashboardData.stats.entregados_hoy}
                        icon="✅"
                        description="Completados"
                    />
                    <StatsCard
                        title="A cobrar hoy"
                        value={dashboardData.stats.a_cobrar}
                        icon="💰"
                        description="Envíos contra entrega"
                    />
                    </div>

                    {/* User Profile Card */}
                    <div className="lg:col-span-1">
                        <UserProfileCard
                            userName={user.user_metadata?.full_name}
                            email={user.email || ''}
                            phone={profile?.phone || undefined}
                            storeName={profile?.store_name || undefined}
                        />
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-slate-50">Acciones Rápidas</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Link
                            href="/etiquetas"
                            className="group bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl text-center flex flex-col items-center justify-center p-6"
                        >
                            <div className="text-3xl mb-2">📦</div>
                            <h3 className="font-semibold">Nuevo Envío</h3>
                            <p className="text-xs opacity-90 mt-1">Genera etiqueta en 30s</p>
                        </Link>
                        
                        <Link
                            href="/mis-envios"
                            className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl hover:border-slate-600 transition-all text-center flex flex-col items-center justify-center p-6"
                        >
                            <div className="text-3xl mb-2">📋</div>
                            <h3 className="font-semibold text-slate-50">Mis Envíos</h3>
                        </Link>

                        <Link
                            href="/tracking"
                            className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl hover:border-slate-600 transition-all text-center flex flex-col items-center justify-center p-6"
                        >
                            <div className="text-3xl mb-2">🔍</div>
                            <h3 className="font-semibold text-slate-50">Rastrear</h3>
                        </Link>

                        <div className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl text-center flex flex-col items-center justify-center p-6 opacity-75 cursor-not-allowed relative overflow-hidden">
                        {/* Overlay de "Próximamente" */}
                        <div className="absolute inset-0 bg-slate-900/20 flex items-center justify-center">
                            <span className="bg-slate-700 text-slate-300 text-xs font-semibold px-3 py-1 rounded-full">Próximamente</span>
                        </div>
                        
                        <div className="text-3xl mb-2">🧮</div>
                        <h3 className="font-semibold text-slate-400">Calculadora</h3>
                        <p className="text-xs text-slate-500 mt-1">Tarifas y zonas</p>
                    </div>
                    </div>
                </div>

                {/* Últimos Envíos */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-slate-50">Últimos Envíos</h2>
                        <Link 
                            href="/mis-envios" 
                            className="text-sm text-orange-400 hover:text-orange-300 underline font-medium"
                        >
                            Ver todos →
                        </Link>
                    </div>
                    
                    <SimpleTable shipments={dashboardData.ultimos_envios} />
                </div>
            </main>
        </div>
    )
}
