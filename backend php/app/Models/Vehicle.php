<?php

/**
 * Vehicle Model
 * 
 * Represents vehicles available for rental in the car rental platform.
 * Contains detailed vehicle information, location, pricing, and availability status.
 * 
 * @property int $id
 * @property int $vendor_id
 * @property string $make
 * @property string $model
 * @property int $year
 * @property string $color
 * @property string $license_plate
 * @property string $type
 * @property string $fuel_type
 * @property string $transmission
 * @property int $seats
 * @property decimal $price_per_day
 * @property string $description
 * @property array $features
 * @property array $images
 * @property decimal $latitude
 * @property decimal $longitude
 * @property string $location_address
 * @property bool $is_available
 * @property string $status
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    use HasFactory;

    protected $fillable = [
        'vendor_id',
        'make',
        'model',
        'year',
        'color',
        'license_plate',
        'type',
        'fuel_type',
        'transmission',
        'seats',
        'price_per_day',
        'description',
        'features',
        'images',
        'latitude',
        'longitude',
        'location_address',
        'is_available',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'features' => 'array',
            'images' => 'array',
            'latitude' => 'decimal:8',
            'longitude' => 'decimal:8',
            'price_per_day' => 'decimal:2',
            'is_available' => 'boolean',
        ];
    }

    /**
     * Get the vendor that owns this vehicle
     */
    public function vendor()
    {
        return $this->belongsTo(User::class, 'vendor_id');
    }

    /**
     * Get bookings for this vehicle
     */
    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    /**
     * Get reviews for this vehicle
     */
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    /**
     * Get average rating for this vehicle
     */
    public function averageRating()
    {
        return $this->reviews()->avg('rating');
    }

    /**
     * Check if vehicle is available for specific dates
     */
    public function isAvailableForDates($startDate, $endDate)
    {
        if (!$this->is_available || $this->status !== 'approved') {
            return false;
        }

        $conflictingBookings = $this->bookings()
            ->where('status', '!=', 'cancelled')
            ->where(function ($query) use ($startDate, $endDate) {
                $query->whereBetween('start_date', [$startDate, $endDate])
                      ->orWhereBetween('end_date', [$startDate, $endDate])
                      ->orWhere(function ($q) use ($startDate, $endDate) {
                          $q->where('start_date', '<=', $startDate)
                            ->where('end_date', '>=', $endDate);
                      });
            })
            ->exists();

        return !$conflictingBookings;
    }
}