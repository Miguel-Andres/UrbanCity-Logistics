'use client'

import { useState, useTransition } from 'react'
import { upsertProfile } from './actions'
import type { ProfileFormData } from '@/lib/types/profile'

interface ProfileFormProps {
    initialData: ProfileFormData
}

export default function ProfileForm({ initialData }: ProfileFormProps) {
    const [formData, setFormData] = useState<ProfileFormData>(initialData)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
    const [isPending, startTransition] = useTransition()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setMessage(null)

        startTransition(async () => {
            const result = await upsertProfile(formData)

            if (result.success) {
                setMessage({ type: 'success', text: '¡Perfil actualizado correctamente!' })
            } else {
                setMessage({ type: 'error', text: result.error || 'Error al guardar' })
            }
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Phone Number */}
            <div>
                <label htmlFor="phone" className="block text-sm font-medium text-zinc-900 dark:text-zinc-50 mb-2">
                    Número de Teléfono
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                    </div>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1234567890"
                        className="w-full pl-10 pr-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                </div>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    Incluye código de país (ej: +54 para Argentina)
                </p>
            </div>

            {/* Store Name */}
            <div>
                <label htmlFor="store_name" className="block text-sm font-medium text-zinc-900 dark:text-zinc-50 mb-2">
                    Nombre de la Tienda
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        id="store_name"
                        name="store_name"
                        value={formData.store_name}
                        onChange={(e) => setFormData({ ...formData, store_name: e.target.value })}
                        placeholder="Mi Tienda"
                        maxLength={100}
                        className="w-full pl-10 pr-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                </div>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    {formData.store_name.length}/100 caracteres
                </p>
            </div>

            {/* Message */}
            {message && (
                <div className={`p-4 rounded-lg ${message.type === 'success'
                        ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                        : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                    }`}>
                    <p className={`text-sm font-medium ${message.type === 'success'
                            ? 'text-green-800 dark:text-green-300'
                            : 'text-red-800 dark:text-red-300'
                        }`}>
                        {message.text}
                    </p>
                </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                    {isPending ? (
                        <>
                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Guardando...
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Guardar Cambios
                        </>
                    )}
                </button>

                <a
                    href="/dashboard"
                    className="px-6 py-3 border-2 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors duration-200"
                >
                    Cancelar
                </a>
            </div>
        </form>
    )
}
