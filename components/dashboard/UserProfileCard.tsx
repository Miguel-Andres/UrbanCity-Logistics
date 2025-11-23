import Link from 'next/link'

interface UserProfileCardProps {
  userName?: string
  email: string
  phone?: string
  storeName?: string
}

export default function UserProfileCard({ 
  userName, 
  email, 
  phone, 
  storeName
}: UserProfileCardProps) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-50">Mi Perfil</h3>
        <Link
          href="/profile"
          className="text-slate-400 hover:text-orange-400 transition-colors text-sm font-medium"
        >
          Editar →
        </Link>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-orange-400 text-sm">👤</span>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Nombre</p>
            <p className="text-sm text-slate-50">{userName || 'No especificado'}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-orange-400 text-sm">📧</span>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Email</p>
            <p className="text-sm text-slate-50">{email}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-orange-400 text-sm">📞</span>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Teléfono</p>
            <p className="text-sm text-slate-50">{phone || 'No agregado'}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-orange-400 text-sm">🏪</span>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Tienda</p>
            <p className="text-sm text-slate-50">{storeName || 'Sin nombre'}</p>
          </div>
        </div>
      </div>

      {/* Datos incompletos */}
      {(!phone || !storeName || !userName) && (
        <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
          <p className="text-xs text-orange-400">
            ⚠️ Completa tu perfil para una mejor experiencia
          </p>
        </div>
      )}
    </div>
  )
}