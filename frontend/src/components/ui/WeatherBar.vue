<template>
  <div class="weather-bar">
    <!-- Loading State -->
    <div v-if="weatherStore.isLoading" class="weather-loading">
      <div class="loading-spinner"></div>
      <span class="loading-text">Loading weather...</span>
    </div>

    <!-- Weather Data -->
    <div v-else-if="weatherStore.weatherData" class="weather-content">
      <!-- Main Weather Info -->
      <div class="weather-main">
        <div class="weather-icon-container">
          <component :is="currentWeatherIcon" class="weather-icon" />
          <div class="temperature">
            {{ Math.round(weatherStore.weatherData.temperature) }}°C
          </div>
        </div>
        <div class="weather-details">
          <div class="condition">{{ t('weather.condition', { c: weatherStore.weatherData.condition }) }}</div>
          <div class="feels-like">{{ t('weather.feels_like') }} {{ Math.round(weatherStore.weatherData.feelsLike) }}°C</div>
        </div>
      </div>

      <!-- Driving Conditions -->
      <div class="driving-conditions" :class="`risk-${weatherStore.drivingConditions.riskLevel}`">
        <div class="conditions-header">
          <component :is="weatherStore.drivingConditions.isGood ? CheckCircle : AlertTriangle" class="conditions-icon" />
          <span class="conditions-text">
            {{ weatherStore.drivingConditions.isGood ? t('weather.good_driving') : t('weather.caution_driving') }}
          </span>
        </div>
        
        <!-- Warnings -->
        <div v-if="weatherStore.drivingConditions.warnings.length > 0" class="warnings">
          <div 
            v-for="warning in weatherStore.drivingConditions.warnings.slice(0, 2)" 
            :key="warning"
            class="warning-item"
          >
            {{ warning }}
          </div>
        </div>
      </div>

      <!-- Weather Stats -->
      <div class="weather-stats">
        <div class="stat-item">
          <Wind class="stat-icon" />
          <span class="stat-value">{{ Math.round(weatherStore.weatherData.windSpeed) }} km/h</span>
        </div>
        <div class="stat-item">
          <Eye class="stat-icon" />
          <span class="stat-value">{{ Math.round(weatherStore.weatherData.visibility / 1000) }} km</span>
        </div>
        <div class="stat-item">
          <Droplets class="stat-icon" />
          <span class="stat-value">{{ weatherStore.weatherData.humidity }}%</span>
        </div>
        <div v-if="weatherStore.weatherData.precipitation > 0" class="stat-item">
          <CloudRain class="stat-icon" />
          <span class="stat-value">{{ weatherStore.weatherData.precipitation }}mm</span>
        </div>
      </div>

      <!-- Update Time -->
      <div class="update-time">
        <span class="time-text">
          {{ t('weather.updated') }} {{ formatTime(weatherStore.lastUpdated) }}
        </span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="weatherStore.error" class="weather-error">
      <Cloud class="error-icon" />
      <span class="error-text">{{ t('weather.unavailable') }}</span>
      <button @click="refreshWeather" class="refresh-btn">
        <RefreshCw class="w-4 h-4" />
      </button>
    </div>

    <!-- Default State -->
    <div v-else class="weather-default">
      <CloudSun class="default-icon" />
      <span class="default-text">{{ t('weather.loading') }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, computed } from 'vue'
import { RefreshCw, Sun, Cloud, CloudRain, CloudSnow, CloudSun, Wind, Eye, Droplets, Car as CarIcon, CheckCircle, AlertTriangle } from 'lucide-vue-next'
import { useWeatherStore } from '../../stores/weather'
import { useTranslation } from '../../services/i18n'

const weatherStore = useWeatherStore()
const { t } = useTranslation()

const currentWeatherIcon = computed(() => {
  const condition = (weatherStore.weatherData?.condition || '').toLowerCase()
  if (condition.includes('rain')) return CloudRain
  if (condition.includes('snow')) return CloudSnow
  if (condition.includes('cloud')) return Cloud
  if (condition.includes('sun') || condition.includes('clear')) return Sun
  return CloudSun
})

let refreshInterval: NodeJS.Timeout | null = null

const formatTime = (date: Date | null): string => {
  if (!date) return ''
  
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  
  if (minutes < 1) return t('weather.just_now')
  if (minutes < 60) return `${minutes}${t('weather.minutes_ago_suffix')}`
  
  const hours = Math.floor(minutes / 60)
  return `${hours}${t('weather.hours_ago_suffix')}`
}

const refreshWeather = () => {
  weatherStore.getCurrentLocationWeather()
}

onMounted(() => {
  // Initial weather fetch
  weatherStore.getCurrentLocationWeather()
  
  // Refresh weather every 10 minutes
  refreshInterval = setInterval(() => {
    weatherStore.getCurrentLocationWeather()
  }, 10 * 60 * 1000)
})

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})
</script>

<style scoped>
.weather-bar {
  background: linear-gradient(135deg, #3b82f6 0%, #0ea5e9 50%, #22d3ee 100%);
  color: white;
  padding: 8px 16px;
  font-size: 14px;
  position: relative;
  overflow: hidden;
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  animation: weatherSlideIn 0.5s ease-out;
}

.weather-bar::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  animation: weatherShimmer 3s infinite;
}

@keyframes weatherSlideIn {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes weatherShimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

.weather-loading {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  justify-content: center;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.weather-content {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  justify-content: space-between;
}

.weather-main {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 120px;
}

.weather-icon-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.weather-icon {
  width: 24px;
  height: 24px;
  animation: weatherFloat 3s ease-in-out infinite;
}

@keyframes weatherFloat {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-2px); }
}

.temperature {
  font-size: 18px;
  font-weight: 600;
}

.weather-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.condition {
  font-weight: 500;
  text-transform: capitalize;
}

.feels-like {
  font-size: 12px;
  opacity: 0.8;
}

.driving-conditions {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 140px;
  padding: 8px 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.driving-conditions.risk-low {
  background: rgba(34, 197, 94, 0.2);
  border-color: rgba(34, 197, 94, 0.3);
}

.driving-conditions.risk-moderate {
  background: rgba(245, 158, 11, 0.2);
  border-color: rgba(245, 158, 11, 0.3);
}

.driving-conditions.risk-high {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.3);
}

.conditions-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
}

.conditions-icon {
  font-size: 16px;
}

.warnings {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.warning-item {
  font-size: 11px;
  opacity: 0.9;
  line-height: 1.2;
}

.weather-stats {
  display: flex;
  gap: 16px;
  align-items: center;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
}

.stat-icon {
  width: 14px;
  height: 14px;
}

.stat-value {
  font-weight: 500;
}

.update-time {
  display: flex;
  align-items: center;
  min-width: 80px;
}

.time-text {
  font-size: 11px;
  opacity: 0.7;
}

.weather-error,
.weather-default {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  justify-content: center;
}

.error-icon,
.default-icon {
  width: 16px;
  height: 16px;
}

.error-text,
.default-text {
  font-size: 12px;
  opacity: 0.8;
}

.refresh-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 4px;
  padding: 4px;
  color: white;
  cursor: pointer;
  transition: background 0.2s;
}

.refresh-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Responsive Design */
@media (max-width: 768px) {
  .weather-content {
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .weather-stats {
    gap: 8px;
  }
  
  .stat-item {
    font-size: 11px;
  }
  
  .driving-conditions {
    min-width: 120px;
    padding: 6px 8px;
  }
  
  .warnings {
    display: none;
  }
}

@media (max-width: 640px) {
  .weather-bar {
    padding: 6px 12px;
    font-size: 12px;
  }
  
  .weather-content {
    justify-content: center;
  }
  
  .weather-main {
    min-width: 100px;
  }
  
  .temperature {
    font-size: 16px;
  }
  
  .weather-icon {
    font-size: 20px;
  }
  
  .update-time {
    display: none;
  }
}
</style>
