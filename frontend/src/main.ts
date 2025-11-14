import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useLocaleStore } from './stores/locale'
import { i18n } from './i18n'
import { initializeCsrf } from './services/api'
import './style.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(i18n)

// Initialize locale store
const localeStore = useLocaleStore()
localeStore.detectCountry()

// Initialize CSRF protection for Laravel
await initializeCsrf()

app.mount('#app')