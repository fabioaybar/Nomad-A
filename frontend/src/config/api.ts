// API Configuration
export const API_CONFIG = {
  // Weatherstack API (Free tier: 1000 requests/month)
  WEATHERSTACK: {
    BASE_URL: 'http://api.weatherstack.com',
    ACCESS_KEY: import.meta.env.VITE_WEATHERSTACK_API_KEY || 'YOUR_WEATHERSTACK_API_KEY',
    ENDPOINTS: {
      CURRENT: '/current'
    }
  },
  
  // MediaStack API (Free tier: 500 requests/month)
  MEDIASTACK_API: {
    BASE_URL: 'http://api.mediastack.com/v1',
    ACCESS_KEY: import.meta.env.VITE_MEDIASTACK_API_KEY || 'YOUR_MEDIASTACK_API_KEY',
    ENDPOINTS: {
      NEWS: '/news',
      LIVE_NEWS: '/news/live'
    }
  },
  
  // Amdoren Currency API for precise daily exchange rates
  AMDOREN_API: {
    BASE_URL: 'https://www.amdoren.com/api',
    ACCESS_KEY: import.meta.env.VITE_AMDOREN_API_KEY || 'YOUR_AMDOREN_API_KEY',
    ENDPOINTS: {
      CURRENCY: '/currency.php'
    }
  },
  
  // IP Geolocation API (Free tier: 1000 requests/month)
  IP_API: {
    BASE_URL: 'http://ip-api.com/json',
    ENDPOINTS: {
      GEOLOCATION: ''
    }
  }
}

// Helper function to get full API URLs
export const getApiUrl = (service: keyof typeof API_CONFIG, endpoint: string, params?: Record<string, string>): string => {
  const config = API_CONFIG[service]
  let url = `${config.BASE_URL}${endpoint}`
  
  if (params) {
    const searchParams = new URLSearchParams(params)
    url += `?${searchParams.toString()}`
  }
  
  return url
}

// Helper function to get weather API URL
export const getWeatherApiUrl = (query: string, units: 'm' | 'f' = 'm'): string => {
  const params = {
    access_key: API_CONFIG.WEATHERSTACK.ACCESS_KEY,
    query,
    units
  }
  
  return getApiUrl('WEATHERSTACK', API_CONFIG.WEATHERSTACK.ENDPOINTS.CURRENT, params)
}

// Helper function to get MediaStack API URL
export const getMediaStackApiUrl = (endpoint: string, params: Record<string, string>): string => {
  const allParams = {
    ...params,
    access_key: API_CONFIG.MEDIASTACK_API.ACCESS_KEY
  }
  
  return getApiUrl('MEDIASTACK_API', endpoint, allParams)
}

// Helper function to get Amdoren API URL for currency conversion
export const getAmdorenApiUrl = (from: string, to: string, amount: number = 1): string => {
  const params = new URLSearchParams({
    api_key: API_CONFIG.AMDOREN_API.ACCESS_KEY,
    from: from,
    to: to,
    amount: amount.toString()
  })
  return `${API_CONFIG.AMDOREN_API.BASE_URL}${API_CONFIG.AMDOREN_API.ENDPOINTS.CURRENCY}?${params.toString()}`
}

// Helper function to get currency conversion URL (CLP to target currency)
export const getCurrencyConversionUrl = (targetCurrency: string): string => {
  return getAmdorenApiUrl('CLP', targetCurrency, 1)
}
