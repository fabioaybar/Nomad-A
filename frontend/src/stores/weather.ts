import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getWeatherApiUrl } from '../config/api'
import { createExternalApisGuard } from './settings'

export interface WeatherData {
  temperature: number
  condition: string
  icon: string
  humidity: number
  windSpeed: number
  visibility: number
  precipitation: number
  uvIndex: number
  feelsLike: number
  pressure: number
  dewPoint: number
  cloudCover: number
}

export interface DrivingConditions {
  isGood: boolean
  riskLevel: 'low' | 'moderate' | 'high'
  warnings: string[]
  recommendations: string[]
}

export const useWeatherStore = defineStore('weather', () => {
  // State
  const weatherData = ref<WeatherData | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const lastUpdated = ref<Date | null>(null)

  // Computed
  const drivingConditions = computed((): DrivingConditions => {
    if (!weatherData.value) {
      return {
        isGood: true,
        riskLevel: 'low',
        warnings: [],
        recommendations: []
      }
    }

    const warnings: string[] = []
    const recommendations: string[] = []
    let riskLevel: 'low' | 'moderate' | 'high' = 'low'

    const { temperature, visibility, windSpeed, precipitation, humidity } = weatherData.value

    // Temperature checks
    if (temperature < 0) {
      warnings.push('Freezing conditions - watch for ice')
      recommendations.push('Check tire pressure, use winter tires if available')
      riskLevel = 'high'
    } else if (temperature < 5) {
      warnings.push('Cold weather - roads may be slippery')
      recommendations.push('Drive carefully, increase following distance')
      riskLevel = 'moderate'
    }

    // Visibility checks
    if (visibility < 1000) {
      warnings.push('Poor visibility - use fog lights')
      recommendations.push('Reduce speed, increase following distance')
      riskLevel = 'high'
    } else if (visibility < 5000) {
      warnings.push('Reduced visibility')
      recommendations.push('Use headlights, drive with caution')
      riskLevel = 'moderate'
    }

    // Wind checks
    if (windSpeed > 50) {
      warnings.push('Strong winds - difficult driving conditions')
      recommendations.push('Hold steering wheel firmly, avoid high-sided vehicles')
      riskLevel = 'high'
    } else if (windSpeed > 30) {
      warnings.push('Moderate winds')
      recommendations.push('Be aware of wind gusts')
      riskLevel = 'moderate'
    }

    // Precipitation checks
    if (precipitation > 10) {
      warnings.push('Heavy precipitation')
      recommendations.push('Use windshield wipers, reduce speed')
      riskLevel = 'moderate'
    }

    // Humidity checks (for fog)
    if (humidity > 90) {
      warnings.push('High humidity - potential fog')
      recommendations.push('Use fog lights if visibility is poor')
      riskLevel = 'moderate'
    }

    return {
      isGood: riskLevel === 'low',
      riskLevel,
      warnings,
      recommendations
    }
  })

  const weatherIcon = computed(() => {
    if (!weatherData.value) return '🌤️'
    
    const condition = weatherData.value.condition.toLowerCase()
    const temp = weatherData.value.temperature

    if (condition.includes('rain') || condition.includes('drizzle')) {
      return temp < 0 ? '🌨️' : '🌧️'
    } else if (condition.includes('snow')) {
      return '❄️'
    } else if (condition.includes('cloud')) {
      return '☁️'
    } else if (condition.includes('clear') || condition.includes('sun')) {
      return temp > 25 ? '☀️' : '🌤️'
    } else if (condition.includes('fog') || condition.includes('mist')) {
      return '🌫️'
    } else if (condition.includes('storm') || condition.includes('thunder')) {
      return '⛈️'
    }
    
    return '🌤️'
  })

  // Actions
  const fetchWeather = async (lat: number, lon: number) => {
    isLoading.value = true
    error.value = null
    
    try {
      // TEMP FEATURE FLAG: ensure external APIs are enabled
      const ensureExternalApisEnabled = createExternalApisGuard()
      ensureExternalApisEnabled()
      // Using Weatherstack API (free tier: 1000 requests/month)
      const query = `${lat},${lon}`
      const response = await fetch(getWeatherApiUrl(query, 'm'))
      
      if (!response.ok) {
        throw new Error('Failed to fetch weather data')
      }
      
      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error.info || 'Weather API error')
      }
      
      weatherData.value = {
        temperature: data.current.temperature,
        condition: data.current.weather_descriptions[0] || 'Unknown',
        icon: data.current.weather_icons[0] || '',
        humidity: data.current.humidity,
        windSpeed: data.current.wind_speed,
        visibility: data.current.visibility * 1000, // Convert km to meters
        precipitation: data.current.precip || 0,
        uvIndex: data.current.uv_index || 0,
        feelsLike: data.current.feelslike,
        pressure: data.current.pressure,
        dewPoint: data.current.temperature, // Weatherstack doesn't provide dew point
        cloudCover: data.current.cloudcover || 0
      }
      
      lastUpdated.value = new Date()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch weather data'
      console.error('Weather fetch error:', err)
    } finally {
      isLoading.value = false
    }
  }

  const fetchWeatherByCity = async (city: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      // TEMP FEATURE FLAG: ensure external APIs are enabled
      const ensureExternalApisEnabled = createExternalApisGuard()
      ensureExternalApisEnabled()
      // Using Weatherstack API with city name
      const response = await fetch(getWeatherApiUrl(encodeURIComponent(city), 'm'))
      
      if (!response.ok) {
        throw new Error('Failed to fetch weather data')
      }
      
      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error.info || 'Weather API error')
      }
      
      weatherData.value = {
        temperature: data.current.temperature,
        condition: data.current.weather_descriptions[0] || 'Unknown',
        icon: data.current.weather_icons[0] || '',
        humidity: data.current.humidity,
        windSpeed: data.current.wind_speed,
        visibility: data.current.visibility * 1000, // Convert km to meters
        precipitation: data.current.precip || 0,
        uvIndex: data.current.uv_index || 0,
        feelsLike: data.current.feelslike,
        pressure: data.current.pressure,
        dewPoint: data.current.temperature, // Weatherstack doesn't provide dew point
        cloudCover: data.current.cloudcover || 0
      }
      
      lastUpdated.value = new Date()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch weather data'
      console.error('Weather fetch error:', err)
    } finally {
      isLoading.value = false
    }
  }

  const getCurrentLocationWeather = async () => {
    if (!navigator.geolocation) {
      error.value = 'Geolocation not supported'
      return
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
      })

      await fetchWeather(position.coords.latitude, position.coords.longitude)
    } catch (err) {
      error.value = 'Failed to get location'
      console.error('Geolocation error:', err)
    }
  }

  return {
    // State
    weatherData,
    isLoading,
    error,
    lastUpdated,
    
    // Computed
    drivingConditions,
    weatherIcon,
    
    // Actions
    fetchWeather,
    fetchWeatherByCity,
    getCurrentLocationWeather
  }
})
