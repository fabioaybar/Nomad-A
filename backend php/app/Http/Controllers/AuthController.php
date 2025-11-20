<?php

namespace App\Http\Controllers;

// Usamos la clase base más simple de Laravel para evitar conflictos
use Illuminate\Routing\Controller;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\DB; 
use Illuminate\Support\Facades\Log; // Para guardar en el log también

class AuthController extends Controller
{
    public function register(Request $request)
    {
        // INICIO DEL BLOQUE DE SEGURIDAD TOTAL
        try {
            // 1. VALIDACIÓN
            $validate = \Illuminate\Support\Facades\Validator::make($request->all(), [
                'name' => ['required', 'string', 'max:100'], 
                'email' => ['required', 'string', 'email', 'max:100', 'unique:usuarios,email'], 
                'password' => ['required', 'confirmed', Password::defaults()],
                'role' => ['required', 'string', 'in:vendor,user'], 
                'phone' => ['nullable', 'string', 'max:20'], 
            ]);

            if ($validate->fails()) {
                return response()->json([
                    'message' => 'Datos inválidos.',
                    'errors' => $validate->errors()
                ], 422);
            }

            // 2. OBTENER ID_ROL
            $roleName = ($request->role === 'vendor') ? 'Vendedor' : 'Cliente';
            
            // Intentamos buscar el rol
            $rolData = DB::table('roles')->where('nombre_rol', $roleName)->first();
            
            if (!$rolData) {
                 throw new \Exception("No se encontró el rol '$roleName' en la tabla 'roles'.");
            }
            $id_rol = $rolData->id_rol;

            // 3. CREAR USUARIO
            // ATENCIÓN: Si esto falla, suele ser porque falta un campo en $fillable en User.php
            $user = User::create([
                'nombre' => $request->name,        
                'email' => $request->email,
                'password' => Hash::make($request->password), 
                'id_rol' => $id_rol,              
                'telefono' => $request->phone,     
                'is_active' => true,              
            ]);

            // 4. RESPUESTA EXITOSA
            return response()->json([
                'success' => true, 
                'message' => 'Registro exitoso.', 
                'user' => [
                    'id_usuario' => $user->id_usuario,
                    'nombre' => $user->nombre,
                    'email' => $user->email,
                ]
            ], 201);

        } catch (\Throwable $e) {
            // --- AQUÍ ESTÁ LA MAGIA ---
            // Si algo falla, devolvemos el error exacto al navegador
            return response()->json([
                'message' => 'Error Fatal en el Backend (Laravel)',
                'error_detail' => $e->getMessage(), // El mensaje técnico del error
                'file' => $e->getFile(),            // En qué archivo ocurrió
                'line' => $e->getLine()             // En qué línea ocurrió
            ], 500);
        }
    }
    public function login(Request $request)
    {
        // 1. Validar datos
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // 2. Buscar usuario
        $user = User::where('email', $request->email)->first();

        // 3. Verificar contraseña
        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Credenciales incorrectas.',
            ], 401);
        }

        // 4. Generar Token (Simulado o real según configuración)
        // Nota: Si no tienes Sanctum configurado, podemos devolver un token falso por ahora para que el frontend funcione.
        $token = 'token-simulado-'.base64_encode($user->email);

        // 5. Responder con el Rol correcto para que Vue redirija
        return response()->json([
            'success' => true,
            'message' => 'Login exitoso',
            'data' => [
                'token' => $token,
                'user' => [
                    'id' => $user->id_usuario,
                    'name' => $user->nombre,
                    'email' => $user->email,
                    // Aquí convertimos el número 2 o 3 en texto para Vue
                    'role' => ($user->id_rol == 2) ? 'vendor' : 'user', 
                ]
            ]
        ]);
    }
}