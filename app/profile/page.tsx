import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getProfile } from './actions'
import ProfileForm from './ProfileForm'

export default async function ProfilePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/access')
    }

    const profile = await getProfile()

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black">
            {/* Header */}
            <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center gap-4">
                        <a
                            href="/dashboard"
                            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                            <svg className="w-6 h-6 text-zinc-600 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </a>
                        <div>
                            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                                Mi Perfil
                            </h1>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                {user.email}
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                    {/* User Info Section */}
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6">
                        <div className="flex items-center gap-4">
                            {user.user_metadata?.avatar_url ? (
                                <img
                                    src={user.user_metadata.avatar_url}
                                    alt={user.user_metadata.full_name || user.email || 'User'}
                                    className="w-20 h-20 rounded-full border-4 border-white/30"
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-full bg-white/20 border-4 border-white/30 flex items-center justify-center text-white font-bold text-2xl">
                                    {user.email?.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div>
                                <h2 className="text-2xl font-bold text-white">
                                    {user.user_metadata?.full_name || 'Usuario'}
                                </h2>
                                <p className="text-orange-100">
                                    Miembro desde {new Date(user.created_at || Date.now()).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
                            Información de Contacto y Negocio
                        </h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                            Completa tu perfil para una mejor experiencia en la plataforma
                        </p>

                        <ProfileForm
                            initialData={{
                                phone: profile?.phone || '',
                                store_name: profile?.store_name || '',
                            }}
                        />
                    </div>
                </div>
            </main>
        </div>
    )
}
