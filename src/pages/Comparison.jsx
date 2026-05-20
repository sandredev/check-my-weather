import CityComparison from '../components/CityComparison'
import { useThingSpeak } from '../hooks/useThingSpeak'
import { useWeatherApi } from '../hooks/useWeatherApi'

export default function Comparison() {
  const { latest, loading: sensorLoading, error: sensorError } = useThingSpeak()
  const { data: cityData, loading: cityLoading, error: cityError } = useWeatherApi()

  const loading = sensorLoading || cityLoading

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Comparación con Santa Marta</h1>
        <p className="text-sm text-slate-500 mt-1">
          Compara la temperatura del sensor con el clima actual de la ciudad para determinar si el lugar está refrigerado.
        </p>
      </div>

      {sensorError && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-center text-red-700 text-sm">
          Sensor: {sensorError}
        </div>
      )}

      {cityError && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-center text-amber-700 text-sm">
          Clima ciudad: {cityError}. Usando promedio histórico (30°C) como referencia.
        </div>
      )}

      <CityComparison sensorTemp={latest?.temperature} cityData={cityData} />
    </div>
  )
}
