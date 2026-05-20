const SANTA_MARTA_AVG_TEMP = 30

export default function CityComparison({ sensorTemp, cityData }) {
  const sensorTempNum = sensorTemp != null ? sensorTemp : null
  const cityTemp = cityData?.temperature ?? null

  const isRefrigerated = sensorTempNum != null && cityTemp != null
    ? sensorTempNum < cityTemp - 1
    : null

  const diff = sensorTempNum != null && cityTemp != null
    ? sensorTempNum - cityTemp
    : null

  if (sensorTempNum == null && cityTemp == null) {
    return (
      <div className="rounded-2xl bg-white shadow-md border border-slate-200 p-6 text-center text-slate-400">
        Esperando datos del sensor y de la ciudad...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white shadow-md border border-slate-200 p-6 text-center">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
            Sensor (ESP8266)
          </p>
          <p className="text-4xl font-bold text-blue-600">
            {sensorTempNum != null ? `${sensorTempNum.toFixed(1)}°C` : '--'}
          </p>
          <p className="text-xs text-slate-400 mt-2">
            {sensorTempNum != null
              ? `Humedad: --`
              : 'Sin datos'}
          </p>
        </div>

        <div className="rounded-2xl bg-white shadow-md border border-slate-200 p-6 text-center">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
            {cityData?.cityName ?? 'Santa Marta'}
          </p>
          {cityTemp != null
            ? <p className="text-4xl font-bold text-orange-500">{cityTemp.toFixed(1)}°C</p>
            : <p className="text-4xl font-bold text-slate-300">{SANTA_MARTA_AVG_TEMP}°C</p>
          }
          <p className="text-xs text-slate-400 mt-2">
            {cityData?.description ?? 'Promedio histórico'}
          </p>
        </div>
      </div>

      {diff != null && (
        <div className="rounded-2xl bg-white shadow-md border border-slate-200 p-6 text-center">
          <p className="text-sm text-slate-500 uppercase tracking-wider mb-2">Diferencia</p>
          <p className="text-2xl font-semibold text-slate-700">
            {diff > 0 ? '+' : ''}{diff.toFixed(1)}°C
          </p>
        </div>
      )}

      {isRefrigerated != null && (
        <div className={`rounded-2xl shadow-md border p-6 text-center ${
          isRefrigerated
            ? 'bg-blue-50 border-blue-300 text-blue-800'
            : 'bg-red-50 border-red-300 text-red-800'
        }`}>
          <p className="text-lg font-semibold mb-1">
            {isRefrigerated ? '❄️ Lugar Refrigerado' : '🔥 Sin Refrigeración'}
          </p>
          <p className="text-sm">
            {isRefrigerated
              ? `El sensor está ${(cityTemp ?? 0 - sensorTempNum).toFixed(1)}°C por debajo de la temperatura de la ciudad.`
              : `El sensor está a una temperatura similar o superior a la de Santa Marta.`}
          </p>
        </div>
      )}
    </div>
  )
}
