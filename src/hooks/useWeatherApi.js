import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  OPENWEATHER_BASE_URL,
  OPENWEATHER_API_KEY,
  SANTA_MARTA_LAT,
  SANTA_MARTA_LON,
  REFRESH_INTERVAL_MS,
} from '../utils/constants'

export function useWeatherApi() {
  const [cityData, setCityData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function fetchCityWeather() {
      if (!OPENWEATHER_API_KEY) {
        if (!cancelled) {
          setError('No se ha configurado API Key de OpenWeatherMap')
          setLoading(false)
        }
        return
      }

      try {
        const url = `${OPENWEATHER_BASE_URL}/weather`
        const params = {
          lat: SANTA_MARTA_LAT,
          lon: SANTA_MARTA_LON,
          appid: OPENWEATHER_API_KEY,
          units: 'metric',
          lang: 'es',
        }
        const response = await axios.get(url, { params })
        if (!cancelled) {
          setCityData({
            temperature: response.data.main.temp,
            humidity: response.data.main.humidity,
            description: response.data.weather[0].description,
            icon: response.data.weather[0].icon,
            cityName: response.data.name,
          })
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Error al obtener datos del clima')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchCityWeather()
    const interval = setInterval(fetchCityWeather, REFRESH_INTERVAL_MS * 5)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  return { data: cityData, loading, error }
}
