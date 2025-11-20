import axios from 'axios'
// ❌ No se puede importar TS desde public/ con Vite. Los desactivamos temporalmente.
// import fallbackApi from '../../public/SVG_Webpay/DB/ts/fallbackApi'
// import { fallbackDb } from '../../public/SVG_Webpay/DB/ts/fallbackDb'
// import '../../public/SVG_Webpay/DB/ts/env'

/**
 * API principal (Axios).
 * baseURL vacío para que /api use el proxy de Vite (ver vite.config.ts).
 */
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/', // -> /api/... será proxied a http://localhost:8000 por Vite
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  withCredentials: false // usamos bearer y CORS simple por ahora
})

// --- Helpers opcionales (los dejamos por si algún código los llama) ---
api.setAuthToken = (token: string) => {
  (api.defaults.headers as any).common = (api.defaults.headers as any).common || {}
  ;(api.defaults.headers as any).common['Authorization'] = `Bearer ${token}`
  try { localStorage.setItem('auth_token', token) } catch {}
}

api.clearAuthToken = () => {
  if ((api.defaults.headers as any).common) {
    delete (api.defaults.headers as any).common['Authorization']
  }
  try { localStorage.removeItem('auth_token') } catch {}
}

api.setCsrfToken = (token: string) => {
  (api.defaults.headers as any).common = (api.defaults.headers as any).common || {}
  ;(api.defaults.headers as any).common['X-CSRF-TOKEN'] = token
}

// Interceptor de request básico
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers = config.headers || {}
      ;(config.headers as any).Authorization = `Bearer ${token}`
    }
    const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
    if (csrf) {
      config.headers = config.headers || {}
      ;(config.headers as any)['X-CSRF-TOKEN'] = csrf
    }
  } catch {}
  return config
})

// Interceptor de respuesta básico (sin fallbacks por ahora)
api.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject(error)
)

export const initializeCsrf = async () => {
  try {
    const res = await api.get('/csrf-token')
    if (res?.data?.token) api.setCsrfToken(res.data.token)
  } catch (e) {
    // Podemos ignorar si tu backend no expone /csrf-token
  }
}

export { api }
export default api
