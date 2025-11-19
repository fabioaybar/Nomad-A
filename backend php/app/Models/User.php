// app/Models/User.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    // --- INICIO DE MODIFICACIONES ---

    protected $table = 'usuarios';
    protected $primaryKey = 'id_usuario';

    protected $fillable = [
        'nombre',       // <-- CAMBIADO: Usar el nombre del campo de tu BD
        'email',
        'password',
        'id_rol',       // <-- AÑADIDO: Para guardar el rol (FK a roles.id_rol)
        // Campos opcionales que podríamos rellenar:
        'telefono', 
        'direccion', 
        'ciudad', 
        'pais',
        'is_active',
        // 'role', (Quitado porque en la BD es id_rol)
    ];

    // --- FIN DE MODIFICACIONES ---

    protected $hidden = [
        'password',
        'remember_token',
    ];
// ... el resto del código (incluyendo hasRole, castings, y relaciones)