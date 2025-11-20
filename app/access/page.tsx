import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function AccessPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Si el usuario está autenticado, redirigir a dashboard
    if (user) {
        redirect('/dashboard')
    }

    // Función de login con Google
    async function signInWithGoogle() {
        'use server'

        // Debug: verificar variables de entorno
        console.log('🔍 Debug Environment Variables:')
        console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
        console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
        console.log('NEXT_PUBLIC_SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL)

        const supabase = await createClient()
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
            },
        })

        if (error) {
            console.error('❌ Error signing in:', error)
            return
        }

        if (data.url) {
            console.log('✅ Redirecting to:', data.url)
            redirect(data.url)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-zinc-950 dark:via-black dark:to-zinc-900">
            <div className="w-full max-w-md px-8">
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-8 border border-zinc-200 dark:border-zinc-800">
                    {/* Logo/Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="relative rounded-full h-16 w-16 bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                            <svg
                                className="w-8 h-8 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-bold text-center text-zinc-900 dark:text-zinc-50 mb-2">
                        Urban City Logistics
                    </h1>
                    <p className="text-center text-zinc-600 dark:text-zinc-400 mb-8">
                        Acceso al sistema
                    </p>

                    {/* Google Sign In Button */}
                    <form action={signInWithGoogle}>
                        <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-3 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-2 border-zinc-300 dark:border-zinc-700 rounded-lg px-6 py-3 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {/* Google Icon */}
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            Continuar con Google
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-500">
                        Al continuar, aceptas nuestros términos de servicio
                    </p>
                </div>
            </div>
        </div>
    )
}
