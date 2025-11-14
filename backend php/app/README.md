# App - Lógica de Aplicación Laravel

Este directorio contiene toda la lógica de aplicación del backend Laravel. Aquí se encuentran los controladores, modelos, middleware y proveedores de servicios que forman el núcleo de la API.

## 📁 Estructura del Directorio

```
app/
├── Http/                  # Lógica HTTP
│   ├── Controllers/      # Controladores de API
│   │   └── API/         # Controladores específicos de API
│   └── Middleware/       # Middleware personalizado
├── Models/               # Modelos Eloquent
├── Providers/            # Proveedores de servicios
└── README.md            # Esta documentación
```

## 🎯 Propósito

El directorio `app/` es el corazón de la aplicación Laravel, conteniendo:

- **Controladores**: Manejan las peticiones HTTP y la lógica de negocio
- **Modelos**: Definen la estructura de datos y relaciones
- **Middleware**: Procesan peticiones antes de llegar a los controladores
- **Proveedores**: Configuran servicios y dependencias

## 🏗️ Componentes Principales

### Controladores HTTP (`app/Http/Controllers/`)

#### API Controllers (`app/Http/Controllers/API/`)

**AdminController.php**
- **Propósito**: Gestiona operaciones administrativas
- **Endpoints**:
  - `GET /api/admin/dashboard` - Estadísticas del panel
  - `GET /api/admin/users` - Listar usuarios
  - `PUT /api/admin/users/{id}/status` - Actualizar estado de usuario
  - `GET /api/admin/vehicles` - Listar vehículos
  - `PUT /api/admin/vehicles/{id}/status` - Actualizar estado de vehículo

**AuthController.php**
- **Propósito**: Maneja autenticación y autorización
- **Endpoints**:
  - `POST /api/auth/register` - Registro de usuario
  - `POST /api/auth/login` - Inicio de sesión
  - `POST /api/auth/logout` - Cierre de sesión
  - `GET /api/auth/profile` - Obtener perfil
  - `PUT /api/auth/profile` - Actualizar perfil

**BookingController.php**
- **Propósito**: Gestiona reservas de vehículos
- **Endpoints**:
  - `GET /api/bookings` - Listar reservas del usuario
  - `POST /api/bookings` - Crear reserva
  - `GET /api/bookings/{id}` - Obtener detalles de reserva
  - `PUT /api/bookings/{id}/status` - Actualizar estado de reserva

**ExternalApiController.php**
- **Propósito**: Integra APIs externas
- **Endpoints**:
  - `GET /api/news` - Obtener noticias
  - `GET /api/currency` - Obtener tasas de cambio
  - `POST /api/geocode` - Geocodificar dirección
  - `POST /api/reverse-geocode` - Geocodificación inversa

**ReviewController.php**
- **Propósito**: Maneja reseñas y calificaciones
- **Endpoints**:
  - `GET /api/vehicles/{id}/reviews` - Obtener reseñas del vehículo
  - `POST /api/reviews` - Crear reseña
  - `PUT /api/reviews/{id}` - Actualizar reseña
  - `DELETE /api/reviews/{id}` - Eliminar reseña

**VehicleController.php**
- **Propósito**: Gestiona vehículos
- **Endpoints**:
  - `GET /api/vehicles` - Listar vehículos (público)
  - `GET /api/vehicles/{id}` - Obtener detalles del vehículo
  - `POST /api/vehicles` - Crear vehículo (vendedor)
  - `PUT /api/vehicles/{id}` - Actualizar vehículo (vendedor)
  - `DELETE /api/vehicles/{id}` - Eliminar vehículo (vendedor)

### Middleware (`app/Http/Middleware/`)

**EnsureEmailIsVerified.php**
- **Propósito**: Asegura que el email del usuario esté verificado
- **Uso**: Aplicado a rutas críticas que requieren verificación
- **Lógica**: Verifica `email_verified_at` en el modelo User

**RoleMiddleware.php**
- **Propósito**: Verifica roles de usuario para rutas protegidas
- **Roles Soportados**: admin, vendor, user
- **Uso**: Aplicado a rutas que requieren roles específicos
- **Lógica**: Verifica el campo `role` en el modelo User

### Modelos (`app/Models/`)

**User.php**
- **Propósito**: Modelo de usuario con autenticación
- **Características**:
  - Autenticación con Laravel Sanctum
  - Roles: user, vendor, admin
  - Verificación de email
  - Relaciones con Vehicle, Booking, Review

**Vehicle.php**
- **Propósito**: Modelo de vehículo
- **Características**:
  - Información detallada del vehículo
  - Relación con User (vendedor)
  - Relaciones con Booking, Review
  - Scopes para filtrado

**Booking.php**
- **Propósito**: Modelo de reserva
- **Características**:
  - Fechas de inicio y fin
  - Cálculo de total
  - Estados: pending, confirmed, active, completed, cancelled
  - Relaciones con User, Vehicle, Payment

**Review.php**
- **Propósito**: Modelo de reseña
- **Características**:
  - Calificación (1-5 estrellas)
  - Comentario opcional
  - Relaciones con User, Vehicle, Booking

**Payment.php**
- **Propósito**: Modelo de pago
- **Características**:
  - Monto y método de pago
  - ID de transacción
  - Estados: pending, completed, failed, refunded
  - Relación con Booking

### Proveedores (`app/Providers/`)

**AppServiceProvider.php**
- **Propósito**: Configuración general de la aplicación
- **Funciones**:
  - Registro de servicios
  - Configuración de bindings
  - Bootstrapping de la aplicación

**AuthServiceProvider.php**
- **Propósito**: Configuración de autenticación
- **Funciones**:
  - Definición de políticas
  - Configuración de guards
  - Registro de providers de autenticación

**EventServiceProvider.php**
- **Propósito**: Configuración de eventos
- **Funciones**:
  - Registro de listeners
  - Configuración de eventos
  - Mapeo de eventos a listeners

**RouteServiceProvider.php**
- **Propósito**: Configuración de rutas
- **Funciones**:
  - Definición de prefijos
  - Configuración de middleware
  - Binding de modelos

## 🔧 Patrones de Diseño Utilizados

### Repository Pattern
```php
// Ejemplo de uso en controladores
class VehicleController extends Controller
{
    protected $vehicleRepository;
    
    public function __construct(VehicleRepository $vehicleRepository)
    {
        $this->vehicleRepository = $vehicleRepository;
    }
    
    public function index()
    {
        return $this->vehicleRepository->getAllWithFilters();
    }
}
```

### Service Layer Pattern
```php
// Ejemplo de servicio
class BookingService
{
    public function createBooking(array $data): Booking
    {
        // Lógica de negocio para crear reserva
        $booking = Booking::create($data);
        
        // Procesar pago
        $this->processPayment($booking);
        
        // Enviar notificaciones
        $this->sendNotifications($booking);
        
        return $booking;
    }
}
```

### Factory Pattern
```php
// Ejemplo de factory para notificaciones
class NotificationFactory
{
    public static function create(string $type, array $data): NotificationInterface
    {
        return match($type) {
            'email' => new EmailNotification($data),
            'sms' => new SmsNotification($data),
            'push' => new PushNotification($data),
            default => throw new InvalidArgumentException("Tipo de notificación no soportado: {$type}")
        };
    }
}
```

## 🛡️ Seguridad y Validación

### Validación de Request
```php
// Ejemplo de Form Request
class CreateVehicleRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'make' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'year' => 'required|integer|min:1900|max:' . date('Y'),
            'price_per_day' => 'required|numeric|min:0',
            'location_address' => 'required|string|max:500',
        ];
    }
    
    public function authorize(): bool
    {
        return auth()->user()->role === 'vendor';
    }
}
```

### Autorización con Policies
```php
// Ejemplo de Policy
class VehiclePolicy
{
    public function update(User $user, Vehicle $vehicle): bool
    {
        return $user->id === $vehicle->user_id || $user->role === 'admin';
    }
    
    public function delete(User $user, Vehicle $vehicle): bool
    {
        return $user->id === $vehicle->user_id || $user->role === 'admin';
    }
}
```

## 📊 Relaciones de Modelos

### User (Usuario)
```php
// Relaciones del modelo User
public function vehicles(): HasMany
{
    return $this->hasMany(Vehicle::class);
}

public function bookings(): HasMany
{
    return $this->hasMany(Booking::class);
}

public function reviews(): HasMany
{
    return $this->hasMany(Review::class);
}
```

### Vehicle (Vehículo)
```php
// Relaciones del modelo Vehicle
public function user(): BelongsTo
{
    return $this->belongsTo(User::class);
}

public function bookings(): HasMany
{
    return $this->hasMany(Booking::class);
}

public function reviews(): HasMany
{
    return $this->hasMany(Review::class);
}
```

### Booking (Reserva)
```php
// Relaciones del modelo Booking
public function user(): BelongsTo
{
    return $this->belongsTo(User::class);
}

public function vehicle(): BelongsTo
{
    return $this->belongsTo(Vehicle::class);
}

public function payment(): HasOne
{
    return $this->hasOne(Payment::class);
}

public function review(): HasOne
{
    return $this->hasOne(Review::class);
}
```

## 🔄 Flujos de Datos

### Flujo de Autenticación
1. **Login**: `AuthController@login`
2. **Validación**: Credenciales y verificación de email
3. **Token**: Generación de token Sanctum
4. **Respuesta**: Token y datos del usuario

### Flujo de Reserva
1. **Creación**: `BookingController@store`
2. **Validación**: Disponibilidad del vehículo
3. **Cálculo**: Total basado en fechas y precio
4. **Pago**: Procesamiento de pago
5. **Notificación**: Email de confirmación

### Flujo de Reseña
1. **Creación**: `ReviewController@store`
2. **Validación**: Usuario debe tener reserva completada
3. **Cálculo**: Actualización de rating promedio
4. **Notificación**: Notificación al vendedor

## 🧪 Pruebas

### Pruebas de Controladores
```php
// Ejemplo de prueba de controlador
class VehicleControllerTest extends TestCase
{
    use RefreshDatabase;
    
    public function test_can_list_vehicles()
    {
        Vehicle::factory()->count(3)->create();
        
        $response = $this->getJson('/api/vehicles');
        
        $response->assertStatus(200)
                ->assertJsonCount(3, 'data');
    }
    
    public function test_vendor_can_create_vehicle()
    {
        $vendor = User::factory()->vendor()->create();
        
        $response = $this->actingAs($vendor)
                        ->postJson('/api/vehicles', [
                            'make' => 'Toyota',
                            'model' => 'Camry',
                            'year' => 2022,
                            'price_per_day' => 50000,
                            'location_address' => 'Santiago, Chile'
                        ]);
        
        $response->assertStatus(201)
                ->assertJsonFragment(['make' => 'Toyota']);
    }
}
```

### Pruebas de Modelos
```php
// Ejemplo de prueba de modelo
class VehicleTest extends TestCase
{
    use RefreshDatabase;
    
    public function test_vehicle_belongs_to_user()
    {
        $user = User::factory()->create();
        $vehicle = Vehicle::factory()->create(['user_id' => $user->id]);
        
        $this->assertInstanceOf(User::class, $vehicle->user);
        $this->assertEquals($user->id, $vehicle->user->id);
    }
    
    public function test_vehicle_has_many_bookings()
    {
        $vehicle = Vehicle::factory()->create();
        Booking::factory()->count(3)->create(['vehicle_id' => $vehicle->id]);
        
        $this->assertCount(3, $vehicle->bookings);
    }
}
```

## 🔧 Comandos Artisan Personalizados

### Crear Comando
```bash
php artisan make:command CreateAdminUser
```

### Ejemplo de Comando
```php
class CreateAdminUser extends Command
{
    protected $signature = 'user:create-admin {email} {password}';
    protected $description = 'Crear usuario administrador';
    
    public function handle()
    {
        $email = $this->argument('email');
        $password = $this->argument('password');
        
        User::create([
            'name' => 'Administrador',
            'email' => $email,
            'password' => Hash::make($password),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);
        
        $this->info('Usuario administrador creado exitosamente');
    }
}
```

## 📈 Optimización y Performance

### Eager Loading
```php
// Evitar N+1 queries
$vehicles = Vehicle::with(['user', 'bookings', 'reviews'])->get();
```

### Caché de Consultas
```php
// Cachear consultas costosas
$popularVehicles = Cache::remember('popular_vehicles', 3600, function () {
    return Vehicle::withCount('bookings')
                  ->orderBy('bookings_count', 'desc')
                  ->take(10)
                  ->get();
});
```

### Índices de Base de Datos
```php
// En migraciones
Schema::table('vehicles', function (Blueprint $table) {
    $table->index(['make', 'model']);
    $table->index('price_per_day');
    $table->index('location_address');
});
```

## 🆘 Solución de Problemas

### Problemas Comunes

#### Error de Autenticación
```bash
# Verificar configuración de Sanctum
php artisan config:clear
php artisan sanctum:install
```

#### Error de Relaciones
```bash
# Verificar migraciones
php artisan migrate:status
php artisan migrate:fresh --seed
```

#### Error de Middleware
```bash
# Verificar registro de middleware
php artisan route:list
php artisan config:cache
```

### Debug
```php
// Logging en controladores
Log::info('Creando vehículo', ['user_id' => auth()->id(), 'data' => $request->all()]);

// Debug de consultas
DB::enableQueryLog();
// ... ejecutar consultas
dd(DB::getQueryLog());
```

## 📚 Recursos Adicionales

- [Laravel Documentation](https://laravel.com/docs)
- [Eloquent ORM](https://laravel.com/docs/eloquent)
- [Laravel Sanctum](https://laravel.com/docs/sanctum)
- [Form Requests](https://laravel.com/docs/validation#form-request-validation)
- [Policies](https://laravel.com/docs/authorization#creating-policies)

## 🤝 Contribuir

1. Sigue las convenciones de Laravel
2. Escribe pruebas para nueva funcionalidad
3. Documenta métodos públicos
4. Usa type hints y return types
5. Mantén el código limpio y legible

---

**Lógica de aplicación construida con ❤️ usando Laravel**
