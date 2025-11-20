import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { UserMenu } from '@/app/components/UserMenu'
import Link from 'next/link'
import { getProfile } from '@/app/profile/actions'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Si no está autenticado, redirigir a /access
    if (!user) {
        redirect('/access')
    }

    // Obtener perfil del usuario
    const profile = await getProfile()

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black">
            {/* Header */}
            <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative rounded-full h-10 w-10 bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                                <svg
                                    className="w-5 h-5 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                    />
                                </svg>
                            </div>
                            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                                Urban City Logistics
                            </h1>
                        </div>
                        <UserMenu user={user} />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-8 border border-zinc-200 dark:border-zinc-800">
                    {/* Welcome Section */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
                            ¡Bienvenido, {user.user_metadata?.full_name || user.email?.split('@')[0]}! 👋
                        </h2>
                        <p className="text-zinc-600 dark:text-zinc-400">
                            Has iniciado sesión exitosamente en el sistema.
                        </p>
                    </div>

                    {/* User Info Card */}
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-zinc-800 dark:to-zinc-800 rounded-xl p-6 mb-8 border border-orange-200 dark:border-zinc-700">
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
                            Información de tu cuenta
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <div>
                                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Nombre</p>
                                    <p className="text-zinc-900 dark:text-zinc-100">{user.user_metadata?.full_name || 'No especificado'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <div>
                                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Email</p>
                                    <p className="text-zinc-900 dark:text-zinc-100">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Teléfono</p>
                                    <p className="text-zinc-900 dark:text-zinc-100">
                                        {profile?.phone || (
                                            <Link href="/profile" className="text-orange-600 dark:text-orange-400 hover:underline text-sm">
                                                Agregar teléfono →
                                            </Link>
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Nombre de Tienda</p>
                                    <p className="text-zinc-900 dark:text-zinc-100">
                                        {profile?.store_name || (
                                            <Link href="/profile" className="text-orange-600 dark:text-orange-400 hover:underline text-sm">
                                                Agregar nombre →
                                            </Link>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div>
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
                            Accesos rápidos
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <Link
                                href="/etiquetas"
                                className="group p-6 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 rounded-xl hover:border-orange-500 dark:hover:border-orange-500 transition-all duration-200 hover:shadow-lg"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50 transition-colors">
                                        <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                        </svg>
                                    </div>
                                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-50">Etiquetas</h4>
                                </div>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                    Genera etiquetas de envío
                                </p>
                            </Link>

                            <Link
                                href="/profile"
                                className="group p-6 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 rounded-xl hover:border-orange-500 dark:hover:border-orange-500 transition-all duration-200 hover:shadow-lg"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50 transition-colors">
                                        <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-50">Mi Perfil</h4>
                                </div>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                    Edita tu información
                                </p>
                            </Link>

                            <Link
                                href="/tracking"
                                className="group p-6 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 rounded-xl hover:border-orange-500 dark:hover:border-orange-500 transition-all duration-200 hover:shadow-lg"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50 transition-colors">
                                        <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-50">Tracking</h4>
                                </div>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                    Rastrea tus envíos
                                </p>
                            </Link>

                            <div className="p-6 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 rounded-xl opacity-50 cursor-not-allowed">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg">
                                        <svg className="w-6 h-6 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <h4 className="font-semibold text-zinc-600 dark:text-zinc-500">Reportes</h4>
                                </div>
                                <p className="text-sm text-zinc-500 dark:text-zinc-600">
                                    Próximamente
                                </p>
                            </div>

                            <div className="p-6 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 rounded-xl opacity-50 cursor-not-allowed">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg">
                                        <svg className="w-6 h-6 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <h4 className="font-semibold text-zinc-600 dark:text-zinc-500">Configuración</h4>
                                </div>
                                <p className="text-sm text-zinc-500 dark:text-zinc-600">
                                    Próximamente
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
