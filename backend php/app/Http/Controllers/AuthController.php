<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\DB; // <-- NECESARIO para consultar la tabla 'roles'

class AuthController extends Controller
{
    /**
     * Maneja el registro de nuevos usuarios (Cliente o Vendedor).
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        // 1. VALIDACIÓN
        // IMPORTANTE: Estos nombres deben coincidir con los campos que tu frontend de Vue envía
        $request->validate([
            'nombre' => ['required', 'string', 'max:100'], 
            'email' => ['required', 'string', 'email', 'max:100', 'unique:usuarios,email'], 
            'password' => ['required', 'confirmed', Password::defaults()],
            'rol_seleccionado' => ['required', 'string', 'in:vendedor,cliente'], // Espera las cadenas 'vendedor' o 'cliente'
        ]);

        // 2. OBTENER ID_ROL
        // Convertimos la cadena de rol (vendedor/cliente) al ID numérico (2/3)
        $roleName = ($request->rol_seleccionado === 'vendedor') ? 'Vendedor' : 'Cliente';
        
        // Buscamos el ID numérico en la tabla 'roles' de tu BD
        $id_rol = DB::table('roles')
                    ->where('nombre_rol', $roleName)
                    ->value('id_rol'); // Obtiene el valor de 'id_rol' (2 o 3)
        
        // Debería ser imposible, pero es una buena práctica validar
        if (!$id_rol) {
            return response()->json(['message' => 'Error interno: ID de Rol no encontrado.'], 500);
        }

        // 3. CREAR USUARIO
        // Usamos el modelo User (que apunta a la tabla 'usuarios')
        $user = User::create([
            'nombre' => $request->nombre,
            'email' => $request->email,
            'password' => Hash::make($request->password), // Contraseña cifrada
            'id_rol' => $id_rol, // Asignamos el ID del rol (2 o 3)
            'is_active' => true, // Por defecto, activo
            // Si el formulario de registro incluye teléfono, dirección, etc., 
            // agrégalo aquí usando $request->campo y en el $fillable del modelo User.
        ]);

        // 4. RESPUESTA AL FRONTEND
        // Si todo sale bien, respondemos con el usuario creado (sin la contraseña cifrada)
        return response()->json([
            'message' => 'Registro exitoso. Procede a iniciar sesión.', 
            'user' => [
                'id_usuario' => $user->id_usuario,
                'nombre' => $user->nombre,
                'email' => $user->email,
                'id_rol' => $user->id_rol
            ]
        ], 201);
    }
}