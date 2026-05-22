import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  OPEN_METEO_BASE_URL,
  SANTA_MARTA_LAT,
  SANTA_MARTA_LON,
  REFRESH_INTERVAL_MS,
} from '../utils/constants'

const WMO_CODES = {
  0: 'Cielo despejado',
  1: 'Mayormente despejado',
  2: 'Parcialmente nublado',
  3: 'Nublado',
  45: 'Niebla',
  48: 'Niebla con escarcha',
  51: 'Llovizna ligera',
  53: 'Llovizna moderada',
  55: 'Llovizna densa',
  56: 'Llovizna helada ligera',
  57: 'Llovizna helada densa',
  61: 'Lluvia ligera',
  63: 'Lluvia moderada',
  65: 'Lluvia intensa',
  66: 'Lluvia helada ligera',
  67: 'Lluvia helada intensa',
  71: 'Nevada ligera',
  73: 'Nevada moderada',
  75: 'Nevada intensa',
  77: 'Granos de nieve',
  80: 'Chubascos ligeros',
  81: 'Chubascos moderados',
  82: 'Chubascos violentos',
  85: 'Chubascos de nieve ligeros',
  86: 'Chubascos de nieve intensos',
  95: 'Tormenta eléctrica',
  96: 'Tormenta con granizo ligero',
  99: 'Tormenta con granizo intenso',
}

function getWeatherDescription(code) {
  return WMO_CODES[code] ?? 'Clima desconocido'
}

export function useWeatherApi() {
  const [cityData, setCityData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function fetchCityWeather() {
      try {
        const params = {
          latitude: SANTA_MARTA_LAT,
          longitude: SANTA_MARTA_LON,
          current: 'temperature_2m,relative_humidity_2m,weather_code',
          timezone: 'auto',
        }
        const response = await axios.get(`${OPEN_METEO_BASE_URL}/forecast`, { params })
        if (!cancelled) {
          setCityData({
            temperature: response.data.current.temperature_2m,
            humidity: response.data.current.relative_humidity_2m,
            description: getWeatherDescription(response.data.current.weather_code),
            cityName: 'Santa Marta',
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
