export function calcAverage(values) {
  if (!values || values.length === 0) return 0
  const sum = values.reduce((acc, v) => acc + v, 0)
  return sum / values.length
}

export function calcMax(values) {
  if (!values || values.length === 0) return 0
  return Math.max(...values)
}

export function calcMin(values) {
  if (!values || values.length === 0) return 0
  return Math.min(...values)
}

export function calcStdDev(values) {
  if (!values || values.length < 2) return 0
  const avg = calcAverage(values)
  const squaredDiffs = values.map(v => (v - avg) ** 2)
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / (values.length - 1)
  return Math.sqrt(variance)
}

export function calcTrend(values) {
  if (!values || values.length < 3) return 'stable'
  const half = Math.floor(values.length / 2)
  const firstHalf = values.slice(0, half)
  const secondHalf = values.slice(half)
  const avgFirst = calcAverage(firstHalf)
  const avgSecond = calcAverage(secondHalf)
  const diff = avgSecond - avgFirst
  if (diff > 1) return 'rising'
  if (diff < -1) return 'falling'
  return 'stable'
}

export function calcStatistics(values) {
  return {
    average: calcAverage(values),
    max: calcMax(values),
    min: calcMin(values),
    stdDev: calcStdDev(values),
    trend: calcTrend(values),
    count: values.length,
  }
}
