<?php

/**
 * User Model
 * 
 * Represents users in the car rental platform with role-based access control.
 * Supports three roles: user (renter), vendor (car owner), and admin.
 * 
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string $password
 * @property string $role
 * @property string|null $phone
 * @property string|null $address
 * @property decimal|null $latitude
 * @property decimal|null $longitude
 * @property string|null $profile_image
 * @property bool $is_active
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'address',
        'latitude',
        'longitude',
        'profile_image',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'latitude' => 'decimal:8',
            'longitude' => 'decimal:8',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Check if user has a specific role
     * 
     * @param string $role The role to check (user, vendor, admin)
     * @return bool True if user has the specified role
     */
    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    /**
     * Check if user is a vendor (car owner)
     * 
     * @return bool True if user is a vendor
     */
    public function isVendor(): bool
    {
        return $this->hasRole('vendor');
    }

    /**
     * Check if user is an admin
     * 
     * @return bool True if user is an admin
     */
    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }

    /**
     * Get vehicles owned by this vendor
     */
    public function vehicles()
    {
        return $this->hasMany(Vehicle::class, 'vendor_id');
    }

    /**
     * Get bookings made by this user
     */
    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    /**
     * Get reviews written by this user
     */
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}