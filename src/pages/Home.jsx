import WeatherDisplay from '../components/WeatherDisplay'
import WeatherAI from '../components/WeatherAI'
import { useThingSpeak } from '../hooks/useThingSpeak'

export default function Home() {
  const { latest, temps, loading, error } = useThingSpeak()

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
        <h1 className="text-2xl font-bold text-slate-800">Vista General</h1>
        <p className="text-sm text-slate-500 mt-1">
          Datos actuales del sensor. {temps.length} registros cargados.
        </p>
      </div>

      <WeatherDisplay
        temperature={latest?.temperature}
        humidity={latest?.humidity}
        createdAt={latest?.createdAt}
      />

      <WeatherAI
        temperature={latest?.temperature}
        humidity={latest?.humidity}
      />

      {temps.length === 0 && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-6 text-center text-amber-700 text-sm">
          No se encontraron datos del sensor. Verifica el Channel ID y la API Key de ThingSpeak.
        </div>
      )}
    </div>
  )
}
