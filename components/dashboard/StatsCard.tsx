interface StatsCardProps {
  title: string
  value: string | number
  icon: string
  description?: string
  trend?: {
    value: number
    isUp: boolean
  }
}

export default function StatsCard({ title, value, icon, description, trend }: StatsCardProps) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-sm border border-slate-700 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-300">
            {title}
          </p>
          <p className="text-2xl font-bold text-slate-50 mt-1">
            {typeof value === 'number' && value > 1000 
              ? `$${value.toLocaleString('es-AR')}` 
              : value
            }
          </p>
          {description && (
            <p className="text-xs text-slate-400 mt-1">
              {description}
            </p>
          )}
        </div>
        <div className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center text-sm">
          <span className={`flex items-center ${trend.isUp ? 'text-green-400' : 'text-red-400'}`}>
            {trend.isUp ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          <span className="text-slate-400 ml-2">vs ayer</span>
        </div>
      )}
    </div>
  )
}