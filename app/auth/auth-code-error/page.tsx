import Link from 'next/link'

export default function AuthCodeError() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-100 dark:from-zinc-950 dark:via-black dark:to-zinc-900">
            <div className="w-full max-w-md px-8">
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-8 border border-zinc-200 dark:border-zinc-800">
                    {/* Error Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="relative rounded-full h-16 w-16 bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                            <svg
                                className="w-8 h-8 text-red-600 dark:text-red-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-bold text-center text-zinc-900 dark:text-zinc-50 mb-2">
                        Error de Autenticación
                    </h1>
                    <p className="text-center text-zinc-600 dark:text-zinc-400 mb-8">
                        Hubo un problema al iniciar sesión con Google
                    </p>

                    {/* Error Details */}
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                        <p className="text-sm text-red-800 dark:text-red-300">
                            <strong>Posibles causas:</strong>
                        </p>
                        <ul className="mt-2 space-y-1 text-sm text-red-700 dark:text-red-400 list-disc list-inside">
                            <li>El código de autorización expiró</li>
                            <li>Configuración incorrecta en Supabase</li>
                            <li>Credenciales de Google incorrectas</li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <Link
                            href="/access"
                            className="block w-full text-center bg-orange-600 hover:bg-orange-700 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200"
                        >
                            Intentar de nuevo
                        </Link>
                        <Link
                            href="/"
                            className="block w-full text-center bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 font-medium px-6 py-3 rounded-lg transition-colors duration-200"
                        >
                            Volver al inicio
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
