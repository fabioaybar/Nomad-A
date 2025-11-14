<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

Route::get('/', function () {
    return view('welcome');
});

// --- Ruta para probar conexión a la base de datos ---
Route::get('/db-test', function () {
    try {
        DB::connection()->getPdo();
        $db = DB::getDatabaseName();

        $tables = collect(DB::select('SHOW TABLES'))->map(function ($row) {
            return array_values((array)$row)[0] ?? null;
        })->take(15);

        return response()->json([
            'ok' => true,
            'database' => $db,
            'tables_sample' => $tables,
        ]);
    } catch (\Throwable $e) {
        return response()->json([
            'ok' => false,
            'error' => $e->getMessage(),
        ], 500);
    }
});

