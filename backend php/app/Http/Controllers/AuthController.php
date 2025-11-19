<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\DB; 
use Illuminate\Validation\ValidationException; // Para manejar errores de validación de forma limpia

class AuthController extends Controller
{
    /**
     * Maneja el registro de nuevos usuarios (Cliente o Vendedor).
     *
     * Espera campos: 'name', 'email', 'password', 'password_confirmation', 'role', 'phone'.
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        try {
            // 1. VALIDACIÓN: Usamos los nombres de campos que Vue está enviando
            $request->validate([
                'name' => ['required', 'string', 'max:100'], // Campo 'name' del frontend
                'email' => ['required', 'string', 'email', 'max:100', 'unique:usuarios,email'], 
                'password' => ['required', 'confirmed', Password::defaults()],
                'role' => ['required', 'string', 'in:vendor,user'], // Espera las cadenas 'vendor' o 'user' de Vue
                'phone' => ['nullable', 'string', 'max:20'], // Campo 'phone' del frontend (Opcional)
            ]);
        } catch (ValidationException $e) {
            // Si la validación falla, devuelve los errores al frontend
            return response()->json([
                'message' => 'Los datos proporcionados no son válidos.',
                'errors' => $e->errors()
            ], 422);
        }

        // 2. OBTENER ID_ROL
        // Traducimos el rol de Vue ('vendor' o 'user') al nombre de la BD ('Vendedor' o 'Cliente')
        $roleName = ($request->role === 'vendor') ? 'Vendedor' : 'Cliente';
        
        // Buscamos el ID numérico en la tabla 'roles'
        $id_rol = DB::table('roles')
                    ->where('nombre_rol', $roleName)
                    ->value('id_rol'); 
        
        // El rol debería existir, pero es un buen control
        if (!$id_rol) {
            return response()->json(['message' => 'Error interno: Rol de usuario no configurado correctamente en la BD.'], 500);
        }

        // 3. CREAR USUARIO
        // Usamos el modelo User (que apunta a la tabla 'usuarios') y mapeamos los campos de Vue a los de la BD
        $user = User::create([
            'nombre' => $request->name,        // Mapea Vue.name a BD.nombre
            'email' => $request->email,
            'password' => Hash::make($request->password), // Cifra la contraseña
            'id_rol' => $id_rol,               // Asignamos el ID del rol (2 o 3)
            'telefono' => $request->phone,     // Mapea Vue.phone a BD.telefono
            'is_active' => true,               // Por defecto, activo
        ]);

        // 4. RESPUESTA AL FRONTEND
        return response()->json([
            'success' => true, // Añadimos 'success' para que Vue lo maneje fácilmente (ver handleRegister en Vue)
            'message' => 'Registro exitoso. Se ha creado tu cuenta.', 
            'user' => [
                'id_usuario' => $user->id_usuario,
                'nombre' => $user->nombre,
                'email' => $user->email,
                'id_rol' => $user->id_rol
            ]
        ], 201);
    }
}