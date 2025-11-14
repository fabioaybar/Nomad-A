# Frontend - Aplicación Vue.js

Este directorio contiene el frontend de la aplicación de alquiler de vehículos, construido con Vue.js 3.x. Proporciona una interfaz de usuario moderna y responsiva para gestionar vehículos, reservas y más.

## Estructura del Proyecto

```
frontend/
├── src/                    # Código fuente principal
│   ├── components/        # Componentes reutilizables
│   │   ├── layout/       # Componentes de diseño
│   │   └── ui/           # Componentes de interfaz
│   ├── views/            # Páginas de la aplicación
│   │   ├── admin/        # Páginas de administración
│   │   ├── auth/         # Páginas de autenticación
│   │   ├── dashboard/    # Páginas del panel
│   │   └── vendor/       # Páginas del vendedor
│   ├── stores/           # Gestión de estado (Pinia)
│   ├── services/         # Servicios y APIs
│   ├── router/           # Configuración de rutas
│   ├── config/           # Configuración de la aplicación
│   └── types/            # Definiciones de tipos TypeScript
├── public/               # Archivos estáticos
├── dist/                 # Build de producción
└── node_modules/         # Dependencias
```

## Características Principales

### Interfaz de Usuario
- **Vue.js 3**: Framework moderno con Composition API
- **Tailwind CSS**: Estilos utilitarios y responsivos
- **Lucide Icons**: Iconografía moderna y consistente
- **Headless UI**: Componentes accesibles sin estilos

### Gestión de Estado
- **Pinia**: Store moderno para Vue.js
- **Stores Modulares**: auth, locale, notifications, weather
- **Persistencia**: Estado persistente en localStorage

### Funcionalidades
- **Autenticación**: Login, registro y gestión de perfil
- **Búsqueda de Vehículos**: Filtros avanzados y búsqueda por ubicación
- **Reservas**: Sistema completo de reservas
- **Mapas**: Integración con Google Maps
- **Noticias**: Feed de noticias basado en ubicación
- **Clima**: Información meteorológica en tiempo real
- **Moneda**: Conversión de moneda con Amdoren API

## 🛠️ Tecnologías Utilizadas

### Core
- **Vue.js 3.x**: Framework principal
- **TypeScript**: Tipado estático
- **Vite**: Build tool y dev server
- **Vue Router 4**: Enrutamiento SPA

### UI/UX
- **Tailwind CSS**: Framework de CSS
- **Headless UI**: Componentes accesibles
- **Lucide Vue Next**: Iconografía
- **Responsive Design**: Mobile-first

### Estado y Datos
- **Pinia**: Gestión de estado
- **Axios**: Cliente HTTP
- **Vue I18n**: Internacionalización

### APIs Externas
- **Google Maps**: Servicios de ubicación
- **Weatherstack**: Datos meteorológicos
- **MediaStack**: Noticias
- **Amdoren**: Tasas de cambio

## Prerrequisitos

- Node.js 18.x o superior
- npm o yarn
- Git

## 🔧 Instalación y Configuración

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Configurar Entorno
```bash
cp env.example .env
```

### 3. Configurar Variables de Entorno
Edita el archivo `.env`:
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_GOOGLE_MAPS_API_KEY=tu_clave_google_maps
VITE_WEATHERSTACK_API_KEY=tu_clave_weatherstack
VITE_MEDIASTACK_API_KEY=tu_clave_mediastack
VITE_AMDOREN_API_KEY=tu_clave_amdoren
```

### 4. Iniciar Servidor de Desarrollo
```bash
npm run dev
```

La aplicación estará disponible en http://localhost:5173

##  Scripts Disponibles

### Desarrollo
```bash
# Servidor de desarrollo
npm run dev

# Build de desarrollo
npm run build:dev

# Preview del build
npm run preview
```

### Producción
```bash
# Build de producción
npm run build

# Análisis del bundle
npm run build:analyze
```

### Calidad de Código
```bash
# Linting
npm run lint

# Linting con fix
npm run lint:fix

# Type checking
npm run type-check
```

## Componentes Principales

### Layout Components (`src/components/layout/`)
- **Navbar.vue**: Barra de navegación principal
- **Footer.vue**: Pie de página
- **WelcomeScreen.vue**: Pantalla de bienvenida

### UI Components (`src/components/ui/`)
- **CountrySelector.vue**: Selector de país y moneda
- **CurrencyDisplay.vue**: Mostrador de precios
- **NotificationContainer.vue**: Contenedor de notificaciones
- **WeatherBar.vue**: Barra de información meteorológica

## Páginas (Views)

### Autenticación (`src/views/auth/`)
- **LoginPage.vue**: Página de inicio de sesión
- **RegisterPage.vue**: Página de registro

### Usuario (`src/views/`)
- **HomePage.vue**: Página principal
- **VehicleListPage.vue**: Lista de vehículos
- **VehicleDetailPage.vue**: Detalles del vehículo
- **BookingPage.vue**: Página de reserva
- **MyRentalsPage.vue**: Mis alquileres
- **ProfilePage.vue**: Perfil de usuario
- **NewsPage.vue**: Página de noticias

### Administración (`src/views/admin/`)
- **AdminDashboard.vue**: Panel de administración

### Vendedor (`src/views/vendor/`)
- **VendorDashboard.vue**: Panel del vendedor

### Utilidades (`src/views/`)
- **DashboardPage.vue**: Panel principal
- **StatusPage.vue**: Página de estado
- **NotFoundPage.vue**: Página 404

##  Gestión de Estado (Stores)

### Auth Store (`src/stores/auth.ts`)
- **Propósito**: Gestiona autenticación del usuario
- **Estado**: user, token, isAuthenticated
- **Acciones**: login, logout, register, updateProfile

### Locale Store (`src/stores/locale.ts`)
- **Propósito**: Gestiona localización y moneda
- **Estado**: country, currency, exchangeRate
- **Acciones**: detectCountry, selectCountry, fetchExchangeRate

### Notifications Store (`src/stores/notifications.ts`)
- **Propósito**: Gestiona notificaciones del sistema
-. **Estado**: notifications
- **Acciones**: addNotification, removeNotification, clearAll

### Weather Store (`src/stores/weather.ts`)
- **Propósito**: Gestiona datos meteorológicos
- **Estado**: weather, loading, error
- **Acciones**: fetchWeather, updateLocation

## 🔌 Servicios

### API Service (`src/services/api.ts`)
- **Propósito**: Cliente HTTP para comunicación con backend
- **Características**: Interceptores, manejo de errores, autenticación

### I18n Service (`src/services/i18n.ts`)
- **Propósito**: Internacionalización y traducciones
- **Idiomas**: Español, Inglés (extensible)

### Maps Service (`src/services/maps.ts`)
- **Propósito**: Integración con Google Maps
- **Funciones**: Geocodificación, mapas, marcadores

##  Enrutamiento

### Rutas Públicas
- `/` - Página principal
- `/vehicles` - Lista de vehículos
- `/vehicles/:id` - Detalles del vehículo
- `/news` - Noticias
- `/status` - Estado del sistema

### Rutas de Autenticación
- `/login` - Inicio de sesión
- `/register` - Registro
- `/profile` - Perfil de usuario

### Rutas Protegidas
- `/dashboard` - Panel principal
- `/my-rentals` - Mis alquileres
- `/booking/:id` - Proceso de reserva

### Rutas de Administración
- `/admin` - Panel de administración
- `/admin/*` - Subrutas de administración

### Rutas de Vendedor
-. `/vendor` - Panel del vendedor
-. `/vendor/*` - Subrutas del vendedor

## Estilos y Temas

### Tailwind CSS
- **Configuración**: `tailwind.config.js`
- **Colores**: Paleta personalizada para la marca
- **Componentes**: Clases utilitarias
- **Responsive**: Mobile-first approach

### CSS Personalizado
- **Archivo**: `src/style.css`
- **Variables**: CSS custom properties
- **Animaciones**: Transiciones suaves
- **Estados**: Hover, focus, active

## Internacionalización

### Configuración
- **Framework**: Vue I18n
- **Idiomas**: Español (es), Inglés (en)
- **Archivos**: `src/services/i18n.ts`

### Uso en Componentes
```vue
<template>
  <h1>{{ $t('welcome.title') }}</h1>
</template>

<script setup>
import { useTranslation } from '@/services/i18n'
const { t } = useTranslation()
</script>
```
## Pruebas

### Configuración
```bash
# Instalar dependencias de prueba
npm install --save-dev @vue/test-utils vitest

# Ejecutar pruebas
npm run test

# Pruebas con cobertura
npm run test:coverage
```

### Tipos de Pruebas
- **Unit Tests**: Componentes individuales
- **Integration Tests**: Flujos completos
- **E2E Tests**: Pruebas end-to-end

## Build y Despliegue

### Build de Desarrollo
```bash
npm run build:dev
```

### Build de Producción
```bash
npm run build
```

### Optimizaciones
- **Code Splitting**: Carga lazy de rutas
- **Tree Shaking**: Eliminación de código no usado
- **Minificación**: CSS y JS minificados
- **Compresión**: Gzip/Brotli

### Despliegue
```bash
# Build para producción
npm run build

# Los archivos se generan en /dist
# Subir contenido de /dist al servidor web
```

## 🔧 Configuración de Vite

### Archivo de Configuración (`vite.config.ts`)
```typescript
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:8000'
    }
  }
})
```

### Variables de Entorno
- **Prefijo**: `VITE_`
- **Acceso**: `import.meta.env.VITE_VARIABLE`
- **Tipos**: Definidos en `src/types/env.d.ts`

## Seguridad

### Autenticación
- **JWT Tokens**: Almacenados en localStorage
- **Interceptores**: Axios interceptors para tokens
- **Protección de Rutas**: Guards de Vue Router

### Validación
- **Input Validation**: Validación de formularios
- **XSS Protection**: Sanitización de datos
- **CSRF Protection**: Tokens CSRF

## 📊 Monitoreo y Analytics

### Performance
- **Vite Bundle Analyzer**: Análisis del bundle
- **Lighthouse**: Métricas de performance
- **Core Web Vitals**: Métricas de experiencia

### Errores
- **Console Logging**: Logs de desarrollo
- **Error Boundaries**: Manejo de errores
- **User Feedback**: Reportes de errores

## Solución de Problemas

### Problemas Comunes

#### Error de Dependencias
```bash
# Limpiar caché
npm cache clean --force

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

#### Error de Build
```bash
# Verificar tipos
npm run type-check

# Linting
npm run lint

# Build limpio
rm -rf dist
npm run build
```

#### Error de API
```bash
# Verificar variables de entorno
echo $VITE_API_BASE_URL

# Verificar conexión
curl http://localhost:8000/api/status
```

## Estructura de Commits

```
feat: nueva característica
fix: corrección de bug
docs: documentación
style: formato, punto y coma faltante, etc.
refactor: refactorización de código
test: añadir pruebas
chore: mantenimiento
```
