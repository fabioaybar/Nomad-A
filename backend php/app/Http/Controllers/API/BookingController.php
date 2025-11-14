<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class BookingController extends Controller
{
    /**
     * Get user's bookings
     */
    public function index(Request $request)
    {
        $bookings = Booking::with(['vehicle.vendor', 'payment'])
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json($bookings);
    }

    /**
     * Create a new booking
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'vehicle_id' => 'required|exists:vehicles,id',
            'start_date' => 'required|date|after:now',
            'end_date' => 'required|date|after:start_date',
            'pickup_location' => 'required|string',
            'dropoff_location' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $vehicle = Vehicle::findOrFail($request->vehicle_id);

        // Check if user is trying to book their own vehicle
        if ($vehicle->vendor_id === $request->user()->id) {
            return response()->json([
                'message' => 'Cannot book your own vehicle'
            ], 400);
        }

        // Check vehicle availability
        if (!$vehicle->isAvailableForDates($request->start_date, $request->end_date)) {
            return response()->json([
                'message' => 'Vehicle is not available for selected dates'
            ], 400);
        }

        // Calculate total amount
        $startDate = Carbon::parse($request->start_date);
        $endDate = Carbon::parse($request->end_date);
        $totalDays = $startDate->diffInDays($endDate) + 1;
        $totalAmount = $vehicle->price_per_day * $totalDays;

        $booking = Booking::create([
            'user_id' => $request->user()->id,
            'vehicle_id' => $vehicle->id,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'total_amount' => $totalAmount,
            'pickup_location' => $request->pickup_location,
            'dropoff_location' => $request->dropoff_location,
            'notes' => $request->notes,
        ]);

        return response()->json([
            'message' => 'Booking created successfully',
            'booking' => $booking->load(['vehicle.vendor']),
        ], 201);
    }

    /**
     * Get a specific booking
     */
    public function show(Request $request, Booking $booking)
    {
        // Check if user owns this booking or is the vehicle vendor
        if ($booking->user_id !== $request->user()->id && 
            $booking->vehicle->vendor_id !== $request->user()->id &&
            !$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($booking->load(['vehicle.vendor', 'user', 'payment']));
    }

    /**
     * Update booking status
     */
    public function updateStatus(Request $request, Booking $booking)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,confirmed,ongoing,completed,cancelled',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Authorization checks
        $user = $request->user();
        $canUpdate = false;

        if ($user->isAdmin()) {
            $canUpdate = true;
        } elseif ($booking->user_id === $user->id) {
            // Users can only cancel their bookings
            $canUpdate = $request->status === 'cancelled';
        } elseif ($booking->vehicle->vendor_id === $user->id) {
            // Vendors can update bookings for their vehicles
            $canUpdate = true;
        }

        if (!$canUpdate) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $booking->update(['status' => $request->status]);

        return response()->json([
            'message' => 'Booking status updated successfully',
            'booking' => $booking->load(['vehicle.vendor', 'user']),
        ]);
    }

    /**
     * Get vendor's bookings
     */
    public function vendorBookings(Request $request)
    {
        if (!$request->user()->isVendor()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $bookings = Booking::with(['user', 'vehicle', 'payment'])
            ->whereHas('vehicle', function ($query) use ($request) {
                $query->where('vendor_id', $request->user()->id);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json($bookings);
    }

    /**
     * Get booking statistics for vendor dashboard
     */
    public function vendorStats(Request $request)
    {
        if (!$request->user()->isVendor()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $vendorId = $request->user()->id;

        $stats = [
            'total_vehicles' => Vehicle::where('vendor_id', $vendorId)->count(),
            'total_bookings' => Booking::whereHas('vehicle', function ($query) use ($vendorId) {
                $query->where('vendor_id', $vendorId);
            })->count(),
            'pending_bookings' => Booking::whereHas('vehicle', function ($query) use ($vendorId) {
                $query->where('vendor_id', $vendorId);
            })->where('status', 'pending')->count(),
            'total_revenue' => Booking::whereHas('vehicle', function ($query) use ($vendorId) {
                $query->where('vendor_id', $vendorId);
            })->where('status', 'completed')->sum('total_amount'),
            'active_vehicles' => Vehicle::where('vendor_id', $vendorId)
                ->where('is_available', true)
                ->where('status', 'approved')
                ->count(),
        ];

        return response()->json($stats);
    }
}