# Guía de Configuración de API

Esta aplicación utiliza varias APIs externas para proporcionar funcionalidad de clima, noticias y cambio de moneda. Sigue esta guía para configurar tus claves API.

## Claves API Requeridas

### 1. Weatherstack API (Datos del Clima)
- **Propósito**: Proporciona condiciones climáticas actuales, temperatura, humedad, velocidad del viento, etc.
- **Nivel Gratuito**: 1,000 solicitudes por mes
- **Registro**: [https://weatherstack.com/](https://weatherstack.com/)
- **Costo**: Gratis para uso básico

**Pasos de Configuración**:
1. Visita [weatherstack.com](https://weatherstack.com/)
2. Haz clic en "Get Free API Key"
3. Completa tus detalles y crea una cuenta
4. Copia tu clave API desde el panel

### 2. MediaStack API (Contenido de Noticias)
- **Propósito**: Proporciona noticias de turismo, tráfico, leyes de vehículos y actividades al aire libre
- **Nivel Gratuito**: 500 solicitudes por mes
- **Registro**: [https://mediastack.com/](https://mediastack.com/)
- **Costo**: Gratis para uso básico

**Pasos de Configuración**:
1. Visita [mediastack.com](https://mediastack.com/)
2. Haz clic en "Get Free API Key"
3. Completa tus detalles y crea una cuenta
4. Copia tu clave API desde el panel

## Claves API Opcionales

### 3. Amdoren API (Cambio de Moneda)
- **Propósito**: Proporciona tasas de cambio de moneda en tiempo real
- **Nivel Gratuito**: 1,000 solicitudes por mes
- **Registro**: [https://www.amdoren.com/currency-api/](https://www.amdoren.com/currency-api/)
- **Costo**: Gratis para uso básico

**Nota**: Esto es opcional. La aplicación funcionará sin él, pero las características de conversión de moneda no estarán disponibles.

## Configuración del Entorno

### Paso 1: Crear Archivo de Entorno
Genenra el archivo de entorno a la ruta más externa:
```bash
touch '.env'
```

### Paso 2: Añadir Tus Claves API
Edita el archivo `.env` y añade tus claves API reales:

```env
# Weatherstack API
VITE_WEATHERSTACK_API_KEY=tu_clave_real_de_weatherstack_aqui

# MediaStack API
VITE_MEDIASTACK_API_KEY=tu_clave_real_de_mediastack_aqui

# Opcional: Amdoren API para Cambio de Moneda
VITE_AMDOREN_API_KEY=tu_clave_real_de_amdoren_aqui
```

### Paso 3: Reiniciar Servidor de Desarrollo
Después de añadir las claves API, reinicia tu servidor de desarrollo:
```bash
npm run dev
```

## Límites de Uso de API

### Weatherstack
- **Nivel Gratuito**: 1,000 solicitudes/mes
- **Tasa de Actualización**: Cada 10 minutos (6 solicitudes/hora)
- **Uso Mensual**: ~4,320 solicitudes (bien dentro del nivel gratuito)

### MediaStack API
- **Nivel Gratuito**: 500 solicitudes/mes
- **Tasa de Actualización**: Al cargar la página y cambiar categoría
- **Uso Diario**: ~10-20 solicitudes (bien dentro del nivel gratuito)

### Geolocalización IP
- **Nivel Gratuito**: 1,000 solicitudes/mes
- **Uso**: Solo al iniciar la aplicación
- **Uso Mensual**: ~30 solicitudes (bien dentro del nivel gratuito)

## Probar Tu Configuración

1. **Clima**: Verifica si la barra del clima aparece encima de la barra de navegación
2. **Noticias**: Navega a `/news` y ve si los artículos cargan
3. **Detección de País**: Verifica si tu país se detecta automáticamente

## Solución de Problemas

### El Clima No Carga
- Verifica que tu clave API de Weatherstack sea correcta
- Revisa la consola del navegador para mensajes de error
- Asegúrate de que la clave API esté configurada correctamente en `.env`

### Las Noticias No Cargan
- Verifica que tu clave API de MediaStack sea correcta
- Revisa la consola del navegador para mensajes de error
- Asegúrate de que la clave API esté configurada correctamente en `.env`

### Límites de Velocidad de API
Si alcanzas los límites de velocidad:
- Weatherstack: Espera hasta el próximo mes o actualiza a un plan de pago
- MediaStack: Espera hasta el próximo mes o actualiza a un plan de pago

## Despliegue en cloud

Para producción, configura estas variables de entorno en tu plataforma de hosting:
- Vercel: Usa Variables de Entorno en configuración del proyecto
- Netlify: Usa Variables de Entorno en configuración del sitio
- Docker: Usa `--env-file` o variables de entorno