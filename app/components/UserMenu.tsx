'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'

interface UserMenuProps {
    user: User
}

export function UserMenu({ user }: UserMenuProps) {
    const router = useRouter()
    const supabase = createClient()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/')
        router.refresh()
    }

    return (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-white dark:bg-zinc-800 rounded-full px-4 py-2 border border-zinc-200 dark:border-zinc-700 shadow-sm">
                {/* Avatar */}
                {user.user_metadata?.avatar_url ? (
                    <img
                        src={user.user_metadata.avatar_url}
                        alt={user.user_metadata.full_name || user.email || 'User'}
                        className="w-8 h-8 rounded-full"
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center text-white font-semibold text-sm">
                        {user.email?.charAt(0).toUpperCase()}
                    </div>
                )}

                {/* User Info */}
                <div className="hidden sm:block text-sm">
                    <p className="font-medium text-zinc-900 dark:text-zinc-100">
                        {user.user_metadata?.full_name || user.email?.split('@')[0]}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {user.email}
                    </p>
                </div>

                {/* Profile Button */}
                <a
                    href="/profile"
                    className="ml-2 p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-full transition-colors"
                    title="Mi perfil"
                >
                    <svg
                        className="w-5 h-5 text-zinc-600 dark:text-zinc-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                    </svg>
                </a>

                {/* Logout Button */}
                <button
                    onClick={handleSignOut}
                    className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-full transition-colors"
                    title="Cerrar sesión"
                >
                    <svg
                        className="w-5 h-5 text-zinc-600 dark:text-zinc-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                    </svg>
                </button>
            </div>
        </div>
    )
}
