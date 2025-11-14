# Backend - API Laravel

Este directorio contiene el backend de la aplicación de alquiler de vehículos, construido con Laravel 11.x. Proporciona una API RESTful completa para gestionar usuarios, vehículos, reservas y más.

## Estructura del Proyecto

```
backend/
├── app/                    # Lógica de la aplicación
│   ├── Http/              # Controladores HTTP y middleware
│   │   ├── Controllers/   # Controladores de API
│   │   └── Middleware/    # Middleware personalizado
│   ├── Models/            # Modelos Eloquent
│   └── Providers/         # Proveedores de servicios
├── config/                # Archivos de configuración
├── database/              # Migraciones y seeders
├── routes/                # Definiciones de rutas
├── storage/               # Archivos de almacenamiento
└── public/                # Punto de entrada público
```

## Características Principales

### Autenticación y Autorización
- **Laravel Sanctum**: Autenticación JWT para APIs
- **Roles y Permisos**: Sistema RBAC (Usuario, Vendedor, Admin)
- **Middleware Personalizado**: Verificación de roles y email

### Gestión de Datos
- **Modelos Eloquent**: User, Vehicle, Booking, Review, Payment
- **Relaciones**: Definidas entre todas las entidades
- **Validación**: Reglas de validación robustas
- **Migraciones**: Esquema de base de datos versionado

### APIs Externas
- **Google Maps**: Geocodificación y servicios de ubicación
- **News API**: Noticias basadas en ubicación
- **Amdoren API**: Tasas de cambio de moneda en tiempo real

## Tecnologías Utilizadas

- **Laravel 11.x**: Framework PHP principal
- **Laravel Sanctum**: Autenticación API
- **MySQL**: Base de datos relacional
- **Eloquent ORM**: Mapeo objeto-relacional
- **Artisan**: Herramientas de línea de comandos

## Prerrequisitos

- PHP 8.1 o superior
- Composer
- MySQL 8.0 o superior
- Extensiones PHP: BCMath, Ctype, Fileinfo, JSON, Mbstring, OpenSSL, PDO, Tokenizer, XML

## 🔧 Instalación y Configuración

### 1. Instalar Dependencias
```bash
composer install
```

### 2. Configurar Entorno
```bash
cp env.example .env
php artisan key:generate
```

### 3. Configurar Base de Datos
Edita el archivo `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=car_rental_db
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_contraseña
```

### 4. Ejecutar Migraciones
```bash
php artisan migrate
php artisan db:seed
```

### 5. Crear Enlace de Almacenamiento
```bash
php artisan storage:link
```

### 6. Iniciar Servidor
```bash
php artisan serve
```

## 📊 Modelos de Datos

### User (Usuario)
- **Propósito**: Gestiona cuentas de usuario, vendedores y administradores
- **Roles**: user, vendor, admin
- **Campos**: name, email, password, role, email_verified_at

### Vehicle (Vehículo)
- **Propósito**: Almacena información de vehículos disponibles
- **Propietario**: Relación con User (vendor)
- **Campos**: make, model, year, type, price_per_day, location_address

### Booking (Reserva)
- **Propósito**: Gestiona reservas de alquiler
- **Relaciones**: User, Vehicle
- **Campos**: start_date, end_date, total_amount, status

### Review (Reseña)
- **Propósito**: Almacena reseñas y calificaciones
- **Relaciones**: User, Vehicle
- **Campos**: rating, comment, booking_id

### Payment (Pago)
- **Propósito**: Registra transacciones de pago
- **Relaciones**: Booking
- **Campos**: amount, payment_method, transaction_id, status

## Middleware

### RoleMiddleware
- **Propósito**: Verifica roles de usuario para rutas protegidas
- **Uso**: Aplicado a rutas que requieren roles específicos
- **Roles**: admin, vendor, user

### EnsureEmailIsVerified
- **Propósito**: Asegura que el email del usuario esté verificado
- **Uso**: Aplicado a rutas críticas que requieren verificación

## 🔌 Endpoints de API

### Autenticación (`/api/auth/`)
- `POST /register` - Registro de usuario
- `POST /login` - Inicio de sesión
- `POST /logout` - Cierre de sesión
- `GET /profile` - Obtener perfil
- `PUT /profile` - Actualizar perfil

### Vehículos (`/api/vehicles/`)
- `GET /` - Listar vehículos (público)
- `GET /{id}` - Detalles del vehículo (público)
- `POST /` - Crear vehículo (vendedor)
- `PUT /{id}` - Actualizar vehículo (vendedor)
- `DELETE /{id}` - Eliminar vehículo (vendedor)

### Reservas (`/api/bookings/`)
- `GET /` - Listar reservas del usuario
- `POST /` - Crear reserva
- `GET /{id}` - Detalles de la reserva
- `PUT /{id}/status` - Actualizar estado

### Reseñas (`/api/reviews/`)
- `GET /vehicles/{id}/reviews` - Reseñas del vehículo (público)
- `POST /` - Crear reseña
- `PUT /{id}` - Actualizar reseña
- `DELETE /{id}` - Eliminar reseña

### APIs Externas (`/api/`)
- `GET /news` - Noticias basadas en ubicación
- `GET /currency` - Tasas de cambio
- `POST /geocode` - Geocodificar dirección
- `POST /reverse-geocode` - Geocodificación inversa

### Administración (`/api/admin/`)
- `GET /dashboard` - Estadísticas del panel
- `GET /users` - Listar usuarios
- `PUT /users/{id}/status` - Actualizar estado de usuario
- `GET /vehicles` - Listar vehículos
- `PUT /vehicles/{id}/status` - Actualizar estado de vehículo

## Pruebas

### Ejecutar Pruebas
```bash
php artisan test
```

### Pruebas Específicas
```bash
# Pruebas de autenticación
php artisan test --filter=AuthTest

# Pruebas de API
php artisan test --filter=ApiTest

# Pruebas de modelos
php artisan test --filter=ModelTest
```

## Comandos Artisan Útiles

### Base de Datos
```bash
# Crear migración
php artisan make:migration create_table_name

# Crear seeder
php artisan make:seeder TableNameSeeder

# Ejecutar migraciones
php artisan migrate

# Revertir migraciones
php artisan migrate:rollback

# Poblar base de datos
php artisan db:seed
```

### Desarrollo
```bash
# Limpiar caché
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Optimizar para producción
php artisan optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Usuarios
```bash
# Crear usuario administrador
php artisan make:command CreateAdminUser

# Generar clave de aplicación
php artisan key:generate
```

## Seguridad

### Autenticación
- **JWT Tokens**: Tokens seguros con expiración
- **Sanctum**: Autenticación API robusta
- **Verificación de Email**: Requerida para funciones críticas

### Autorización
- **RBAC**: Control de acceso basado en roles
- **Middleware**: Verificación de permisos en rutas
- **Validación**: Sanitización de entrada de datos

### Protección
- **CSRF**: Protección contra ataques CSRF
- **Rate Limiting**: Limitación de velocidad en APIs
- **Validación**: Reglas de validación estrictas

## Monitoreo y Logs

### Logs de Aplicación
- **Ubicación**: `storage/logs/laravel.log`
- **Niveles**: DEBUG, INFO, WARNING, ERROR, CRITICAL
- **Rotación**: Automática por tamaño y tiempo

### Monitoreo de Performance
- **Query Logging**: Registro de consultas lentas
- **Memory Usage**: Monitoreo de uso de memoria
- **Response Times**: Tiempos de respuesta de API

## Despliegue

### Producción
```bash
# Instalar dependencias optimizadas
composer install --optimize-autoloader --no-dev

# Optimizar aplicación
php artisan optimize

# Configurar permisos
chmod -R 755 storage bootstrap/cache
```

### Variables de Entorno de Producción
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://tu-dominio.com

DB_CONNECTION=mysql
DB_HOST=tu-host
DB_DATABASE=tu_base_de_datos
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_contraseña_segura

# Claves API de producción
GOOGLE_MAPS_API_KEY=tu_clave_produccion
NEWS_API_KEY=tu_clave_produccion
AMDOREN_API_KEY=tu_clave_produccion
```

## Configuración de Servidor Web

### Apache
```apache
<VirtualHost *:80>
    ServerName tu-dominio.com
    DocumentRoot /ruta/a/tu/proyecto/public
    
    <Directory /ruta/a/tu/proyecto/public>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

### Nginx
```nginx
server {
    listen 80;
    server_name tu-dominio.com;
    root /ruta/a/tu/proyecto/public;
    
    index index.php;
    
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
    
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

## Solución de Problemas

### Problemas Comunes

#### Error de Permisos
```bash
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

#### Error de Base de Datos
```bash
# Verificar conexión
php artisan tinker
DB::connection()->getPdo();

# Recrear base de datos
php artisan migrate:fresh --seed
```

#### Error de Caché
```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

### Logs de Debug
```bash
# Ver logs en tiempo real
tail -f storage/logs/laravel.log

# Filtrar errores
grep "ERROR" storage/logs/laravel.log
```

## Recursos Adicionales

- [Documentación de Laravel](https://laravel.com/docs)
- [Laravel Sanctum](https://laravel.com/docs/sanctum)
- [Eloquent ORM](https://laravel.com/docs/eloquent)
- [Artisan Commands](https://laravel.com/docs/artisan)

## Contribuir

1. Fork el repositorio
2. Crea una rama de característica
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request
