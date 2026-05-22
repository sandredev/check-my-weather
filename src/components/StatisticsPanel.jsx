import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { calcStatistics } from '../utils/statistics'

const trendIcon = { rising: '📈', falling: '📉', stable: '➡️' }
const trendLabel = { rising: 'Subiendo', falling: 'Bajando', stable: 'Estable' }

function StatCard({ label, value, unit, sub }) {
  return (
    <div className="rounded-xl bg-white shadow-sm border border-slate-200 p-4 text-center">
      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-800">
        {value != null ? `${value.toFixed(1)}${unit}` : '--'}
      </p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  )
}

export default function StatisticsPanel({ temps, humidities }) {
  const tempStats = calcStatistics(temps)
  const humStats = calcStatistics(humidities)

  const chartData = temps.map((t, i) => ({
    index: i + 1,
    temperatura: t,
    humedad: humidities[i] ?? null,
  }))

  function computeDomain(values) {
    const min = Math.min(...values)
    const max = Math.max(...values)
    const diff = max - min || 1
    return [min - diff * 0.1, max + diff * 0.1]
  }

  const tempDomain = temps.length > 0 ? computeDomain(temps) : [0, 40]
  const humDomain = humidities.length > 0 ? computeDomain(humidities) : [0, 100]

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Prom. Temperatura" value={tempStats.average} unit="°C"
          sub={`${trendIcon[tempStats.trend]} ${trendLabel[tempStats.trend]}`} />
        <StatCard label="Máx Temperatura" value={tempStats.max} unit="°C" />
        <StatCard label="Mín Temperatura" value={tempStats.min} unit="°C" />
        <StatCard label="Desv. Estándar" value={tempStats.stdDev} unit="°C" />
        <StatCard label="Prom. Humedad" value={humStats.average} unit="%"
          sub={`${trendIcon[humStats.trend]} ${trendLabel[humStats.trend]}`} />
        <StatCard label="Máx Humedad" value={humStats.max} unit="%" />
        <StatCard label="Mín Humedad" value={humStats.min} unit="%" />
        <StatCard label="Desv. Estándar" value={humStats.stdDev} unit="%" />
      </div>

      <div className="rounded-xl bg-white shadow-sm border border-slate-200 p-4">
        <p className="text-sm font-semibold text-slate-700 mb-3">Historial de Temperatura</p>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="index" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} unit="°C" domain={tempDomain} />
            <Tooltip />
            <Line type="monotone" dataKey="temperatura" stroke="#ef4444" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-xl bg-white shadow-sm border border-slate-200 p-4">
        <p className="text-sm font-semibold text-slate-700 mb-3">Historial de Humedad</p>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="index" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} unit="%" domain={humDomain} />
            <Tooltip />
            <Line type="monotone" dataKey="humedad" stroke="#06b6d4" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
