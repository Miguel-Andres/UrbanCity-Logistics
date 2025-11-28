'use client'

import Link from 'next/link'
import { User } from '@supabase/supabase-js'
import { UserMenu } from '@/app/components/UserMenu'

interface NavbarProps {
  user: User
  title?: string
  subtitle?: string
}

export function Navbar({ user, title = "Urban City Logistics", subtitle }: NavbarProps) {
  return (
    <header className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 relative z-10">
      {/* Background subway lines solo para header */}
      <div className="absolute inset-0 opacity-8">
        <img src="/subway-lines.png" alt="" className="w-full h-full object-cover mix-blend-screen" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/dashboard" className="hover:text-orange-400 transition-colors duration-200">
              <div>
                <h1 className="text-xl font-bold text-slate-50">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-sm text-slate-300">
                    {subtitle}
                  </p>
                )}
              </div>
            </Link>
          </div>
          <UserMenu user={user} />
        </div>
      </div>
    </header>
  )
}