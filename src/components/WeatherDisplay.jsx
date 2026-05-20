export default function WeatherDisplay({ temperature, humidity, createdAt }) {
  const tempColor =
    temperature >= 30 ? 'text-red-500' : temperature >= 25 ? 'text-orange-400' : 'text-blue-400'

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div className="rounded-2xl bg-white shadow-md p-6 border border-slate-200 text-center">
        <p className="text-sm text-slate-500 uppercase tracking-wider font-medium mb-1">Temperatura</p>
        <p className={`text-5xl font-bold ${tempColor}`}>
          {temperature != null ? `${temperature.toFixed(1)}°C` : '--'}
        </p>
        <div className="mt-3 flex justify-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 bg-red-400 rounded-full" />
            &ge;30°C Calor
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 bg-blue-400 rounded-full" />
            &lt;25°C Fresco
          </span>
        </div>
      </div>

      <div className="rounded-2xl bg-white shadow-md p-6 border border-slate-200 text-center">
        <p className="text-sm text-slate-500 uppercase tracking-wider font-medium mb-1">Humedad</p>
        <p className="text-5xl font-bold text-cyan-600">
          {humidity != null ? `${humidity.toFixed(1)}%` : '--'}
        </p>
        <p className="mt-3 text-xs text-slate-400">
          {humidity != null
            ? humidity > 70
              ? 'Alta humedad'
              : humidity > 40
                ? 'Humedad normal'
                : 'Baja humedad'
            : ''}
        </p>
      </div>

      {createdAt && (
        <p className="sm:col-span-2 text-center text-xs text-slate-400">
          Última actualización: {new Date(createdAt).toLocaleString('es-CO')}
        </p>
      )}
    </div>
  )
}
