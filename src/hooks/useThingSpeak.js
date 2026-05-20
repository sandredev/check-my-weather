import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  THINGSPEAK_BASE_URL,
  THINGSPEAK_CHANNEL_ID,
  THINGSPEAK_READ_API_KEY,
  THINGSPEAK_FIELD_TEMP,
  THINGSPEAK_FIELD_HUMIDITY,
  REFRESH_INTERVAL_MS,
  RESULTS_COUNT,
} from '../utils/constants'

function parseFeeds(feeds) {
  if (!feeds || feeds.length === 0) return { temps: [], humidities: [], latest: null }

  const temps = []
  const humidities = []

  for (const entry of feeds) {
    const temp = parseFloat(entry[`field${THINGSPEAK_FIELD_TEMP}`])
    const hum = parseFloat(entry[`field${THINGSPEAK_FIELD_HUMIDITY}`])
    if (!isNaN(temp)) temps.push(temp)
    if (!isNaN(hum)) humidities.push(hum)
  }

  const latest = feeds.length > 0 ? {
    temperature: temps[temps.length - 1] ?? 0,
    humidity: humidities[humidities.length - 1] ?? 0,
    createdAt: feeds[feeds.length - 1].created_at,
  } : null

  return { temps, humidities, latest }
}

export function useThingSpeak() {
  const [data, setData] = useState({ temps: [], humidities: [], latest: null })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function fetchData() {
      try {
        const url = `${THINGSPEAK_BASE_URL}/channels/${THINGSPEAK_CHANNEL_ID}/feeds.json`
        const params = { results: RESULTS_COUNT }
        if (THINGSPEAK_READ_API_KEY) params.api_key = THINGSPEAK_READ_API_KEY

        const response = await axios.get(url, { params })
        if (!cancelled) {
          const parsed = parseFeeds(response.data.feeds)
          setData(parsed)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Error al obtener datos de ThingSpeak')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, REFRESH_INTERVAL_MS)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  return { ...data, loading, error }
}
