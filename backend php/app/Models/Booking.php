<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'vehicle_id',
        'start_date',
        'end_date',
        'total_amount',
        'status',
        'pickup_location',
        'dropoff_location',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'datetime',
            'end_date' => 'datetime',
            'total_amount' => 'decimal:2',
        ];
    }

    /**
     * Get the user that made this booking
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the vehicle for this booking
     */
    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    /**
     * Get payment for this booking
     */
    public function payment()
    {
        return $this->hasOne(Payment::class);
    }

    /**
     * Get review for this booking
     */
    public function review()
    {
        return $this->hasOne(Review::class);
    }

    /**
     * Calculate total days for the booking
     */
    public function getTotalDaysAttribute()
    {
        return $this->start_date->diffInDays($this->end_date) + 1;
    }
}