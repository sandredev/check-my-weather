import StatisticsPanel from '../components/StatisticsPanel'
import { useThingSpeak } from '../hooks/useThingSpeak'

export default function Statistics() {
  const { temps, humidities, loading, error } = useThingSpeak()

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-50 border border-red-200 p-6 text-center text-red-700">
        <p className="font-semibold">Error de conexión</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Estadísticas</h1>
        <p className="text-sm text-slate-500 mt-1">
          Promedios, máximos, mínimos, desviación estándar y tendencia basados en los últimos {temps.length} datos.
        </p>
      </div>

      {temps.length > 0 ? (
        <StatisticsPanel temps={temps} humidities={humidities} />
      ) : (
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-6 text-center text-amber-700 text-sm">
          No hay suficientes datos para mostrar estadísticas.
        </div>
      )}
    </div>
  )
}
