<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

// Importamos los controladores de tus compañeros (Namespace API)
use App\Http\Controllers\API\VehicleController;
use App\Http\Controllers\API\BookingController;
use App\Http\Controllers\API\ReviewController;
use App\Http\Controllers\API\AdminController;
use App\Http\Controllers\API\ExternalApiController;

// NOTA: No importamos AuthController aquí para evitar conflictos. 
// Usaremos la ruta completa para tu controlador de autenticación.

// ============================================================================
// HEALTH CHECK ENDPOINT
// ============================================================================
Route::get('/health', function () {
    return response()->json(['status' => 'healthy', 'timestamp' => now()->toIso8601String()]);
});

// ============================================================================
// RUTAS DE AUTENTICACIÓN (Usando TU controlador App\Http\Controllers\AuthController)
// ============================================================================

// Registro (Apunta a /api/register)
Route::post('/register', [\App\Http\Controllers\AuthController::class, 'register']);

// Login (Apunta a /api/login)
Route::post('/login', [\App\Http\Controllers\AuthController::class, 'login']);

// Mantenemos estas por compatibilidad si el frontend las llama diferente en otros lados
Route::post('/auth/register', [\App\Http\Controllers\AuthController::class, 'register']);
Route::post('/auth/login', [\App\Http\Controllers\AuthController::class, 'login']);


// ============================================================================
// RUTAS PÚBLICAS DEL NEGOCIO (Vehículos, Noticias, etc.)
// ============================================================================

Route::get('/vehicles', [VehicleController::class, 'index']);
Route::get('/vehicles/{vehicle}', [VehicleController::class, 'show']);
Route::get('/vehicles/{vehicle}/reviews', [ReviewController::class, 'index']);

Route::get('/news', [ExternalApiController::class, 'getNews']);
Route::get('/currency', [ExternalApiController::class, 'getCurrencyRates']);


// ============================================================================
// RUTAS PROTEGIDAS (Requieren Login)
// ============================================================================
Route::middleware('auth:sanctum')->group(function () {
    
    // Usamos tu controlador para logout y perfil también
    Route::post('/auth/logout', [\App\Http\Controllers\AuthController::class, 'logout']);
    Route::get('/auth/profile', [\App\Http\Controllers\AuthController::class, 'profile']);
    
    // ... (El resto de rutas de tus compañeros se mantienen igual)
    Route::apiResource('bookings', BookingController::class)->except(['update', 'destroy']);
    
    // ... (Rutas de Vendedor y Admin)
});

// Utilitarios rápidos
Route::get('/ping', function () { return response()->json(['message' => 'pong']); });