<?php
use Illuminate\Support\Facades\DB;

/**
 * Car Rental Platform API Routes
 * 
 * This file contains all API routes for the car rental platform.
 * Routes are organized by functionality and access level.
 */

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\VehicleController;
use App\Http\Controllers\API\BookingController;
use App\Http\Controllers\API\ReviewController;
use App\Http\Controllers\API\AdminController;
use App\Http\Controllers\API\ExternalApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// ============================================================================
// HEALTH CHECK ENDPOINT
// ============================================================================
Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'timestamp' => now()->toISOString(),
        'version' => '1.0.0',
        'services' => [
            'database' => 'connected',
            'cache' => 'available',
            'storage' => 'available'
        ]
    ]);
});

// ============================================================================
// PUBLIC ROUTES (No Authentication Required)
// ============================================================================

// Authentication endpoints
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Vehicle browsing (public)
Route::get('/vehicles', [VehicleController::class, 'index']);
Route::get('/vehicles/{vehicle}', [VehicleController::class, 'show']);

// Reviews (public viewing)
Route::get('/vehicles/{vehicle}/reviews', [ReviewController::class, 'index']);

// External API integrations (public)
Route::get('/news', [ExternalApiController::class, 'getNews']);
Route::get('/currency', [ExternalApiController::class, 'getCurrencyRates']);
Route::post('/geocode', [ExternalApiController::class, 'geocode']);
Route::post('/reverse-geocode', [ExternalApiController::class, 'reverseGeocode']);

// ============================================================================
// PROTECTED ROUTES (Authentication Required)
// ============================================================================
Route::middleware('auth:sanctum')->group(function () {
    
    // User profile management
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/profile', [AuthController::class, 'profile']);
    Route::put('/auth/profile', [AuthController::class, 'updateProfile']);

    // Booking management
    Route::apiResource('bookings', BookingController::class)->except(['update', 'destroy']);
    Route::put('/bookings/{booking}/status', [BookingController::class, 'updateStatus']);

    // Review management
    Route::post('/reviews', [ReviewController::class, 'store']);
    Route::put('/reviews/{review}', [ReviewController::class, 'update']);
    Route::delete('/reviews/{review}', [ReviewController::class, 'destroy']);

    // ========================================================================
    // VENDOR-ONLY ROUTES
    // ========================================================================
    Route::middleware('role:vendor')->group(function () {
        // Vehicle management
        Route::post('/vehicles', [VehicleController::class, 'store']);
        Route::put('/vehicles/{vehicle}', [VehicleController::class, 'update']);
        Route::delete('/vehicles/{vehicle}', [VehicleController::class, 'destroy']);
        
        // Vendor dashboard
        Route::get('/vendor/vehicles', [VehicleController::class, 'vendorVehicles']);
        Route::get('/vendor/bookings', [BookingController::class, 'vendorBookings']);
        Route::get('/vendor/stats', [BookingController::class, 'vendorStats']);
    });

    // ========================================================================
    // ADMIN-ONLY ROUTES
    // ========================================================================
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        // Admin dashboard
        Route::get('/dashboard', [AdminController::class, 'dashboard']);
        
        // User management
        Route::get('/users', [AdminController::class, 'users']);
        Route::put('/users/{user}/status', [AdminController::class, 'updateUserStatus']);
        
        // Vehicle management
        Route::get('/vehicles', [AdminController::class, 'vehicles']);
        Route::put('/vehicles/{vehicle}/status', [AdminController::class, 'updateVehicleStatus']);
        
        // Booking management
        Route::get('/bookings', [AdminController::class, 'bookings']);
    });
});

// ============================================================================
// LEGACY/UTILITY ROUTES
// ============================================================================
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/ping', function () {
    return response()->json(['message' => 'pong']);
});
Route::get('/autos', function () {
    $autos = DB::table('autos')->limit(50)->get();
    return response()->json($autos);
});

// routes/api.php

// (Mantén los "use" que ya tenía el archivo, pero quita el 'use App\Http\Controllers\AuthController;')

// AÑADE SÓLO ESTA LÍNEA DE RUTA:
Route::post('/register', [\App\Http\Controllers\AuthController::class, 'register']);