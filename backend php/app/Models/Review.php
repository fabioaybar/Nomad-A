<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'vehicle_id',
        'booking_id',
        'rating',
        'comment',
    ];

    /**
     * Get the user who wrote this review
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the vehicle being reviewed
     */
    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    /**
     * Get the booking this review is for
     */
    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }
}