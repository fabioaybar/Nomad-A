<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    // 1. Configuración de Tabla
    protected $table = 'usuarios';
    protected $primaryKey = 'id_usuario';

    // 2. SOLUCIÓN AL ERROR 500: Desactivar timestamps automáticos de Laravel
    // Esto evita que busque 'created_at' y 'updated_at'
    public $timestamps = false; 

    // Opcional: Si quieres que Laravel sepa que 'fecha_registro' es tu fecha de creación
    const CREATED_AT = 'fecha_registro';
    const UPDATED_AT = null; // No tienes columna de actualización

    protected $fillable = [
        'nombre',       
        'email',
        'password',
        'id_rol',      
        'telefono',     
        'direccion', 
        'ciudad', 
        'pais',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];
    
    protected $casts = [
        'is_active' => 'boolean',
        'email_verified_at' => 'datetime',
    ];
}