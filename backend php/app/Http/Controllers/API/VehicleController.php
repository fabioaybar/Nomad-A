<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class VehicleController extends Controller
{
    /**
     * Get vehicles with optional filters and location search
     */
    public function index(Request $request)
    {
        $query = Vehicle::with(['vendor', 'reviews'])
            ->where('status', 'approved')
            ->where('is_available', true);

        // Location-based search
        if ($request->has(['latitude', 'longitude', 'radius'])) {
            $lat = $request->latitude;
            $lng = $request->longitude;
            $radius = $request->radius ?: 10; // Default 10km radius

            $query->whereRaw("
                (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * 
                cos(radians(longitude) - radians(?)) + sin(radians(?)) * 
                sin(radians(latitude)))) <= ?
            ", [$lat, $lng, $lat, $radius]);
        }

        // Filters
        if ($request->type) {
            $query->where('type', $request->type);
        }

        if ($request->min_price) {
            $query->where('price_per_day', '>=', $request->min_price);
        }

        if ($request->max_price) {
            $query->where('price_per_day', '<=', $request->max_price);
        }

        if ($request->fuel_type) {
            $query->where('fuel_type', $request->fuel_type);
        }

        if ($request->transmission) {
            $query->where('transmission', $request->transmission);
        }

        if ($request->seats) {
            $query->where('seats', '>=', $request->seats);
        }

        // Search by make/model
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('make', 'like', '%' . $request->search . '%')
                  ->orWhere('model', 'like', '%' . $request->search . '%');
            });
        }

        // Date availability check
        if ($request->has(['start_date', 'end_date'])) {
            $query->whereDoesntHave('bookings', function ($q) use ($request) {
                $q->where('status', '!=', 'cancelled')
                  ->where(function ($subQ) use ($request) {
                      $subQ->whereBetween('start_date', [$request->start_date, $request->end_date])
                           ->orWhereBetween('end_date', [$request->start_date, $request->end_date])
                           ->orWhere(function ($innerQ) use ($request) {
                               $innerQ->where('start_date', '<=', $request->start_date)
                                      ->where('end_date', '>=', $request->end_date);
                           });
                  });
            });
        }

        $vehicles = $query->paginate(12);

        // Add average rating to each vehicle
        $vehicles->getCollection()->transform(function ($vehicle) {
            $vehicle->average_rating = $vehicle->averageRating();
            $vehicle->review_count = $vehicle->reviews->count();
            return $vehicle;
        });

        return response()->json($vehicles);
    }

    /**
     * Get a specific vehicle
     */
    public function show(Vehicle $vehicle)
    {
        $vehicle->load(['vendor', 'reviews.user']);
        $vehicle->average_rating = $vehicle->averageRating();
        $vehicle->review_count = $vehicle->reviews->count();

        return response()->json($vehicle);
    }

    /**
     * Store a new vehicle (Vendor only)
     */
    public function store(Request $request)
    {
        if (!$request->user()->isVendor()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'make' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'year' => 'required|integer|min:1980|max:' . (date('Y') + 1),
            'color' => 'required|string|max:255',
            'license_plate' => 'required|string|max:255|unique:vehicles',
            'type' => 'required|in:sedan,suv,hatchback,convertible,truck,van',
            'fuel_type' => 'required|in:petrol,diesel,electric,hybrid',
            'transmission' => 'required|in:manual,automatic',
            'seats' => 'required|integer|min:1|max:15',
            'price_per_day' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'features' => 'nullable|array',
            'images' => 'nullable|array',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'location_address' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $vehicle = Vehicle::create([
            'vendor_id' => $request->user()->id,
            ...$validator->validated(),
        ]);

        return response()->json([
            'message' => 'Vehicle created successfully',
            'vehicle' => $vehicle->load('vendor'),
        ], 201);
    }

    /**
     * Update vehicle (Vendor only - own vehicles)
     */
    public function update(Request $request, Vehicle $vehicle)
    {
        if (!$request->user()->isVendor() || $vehicle->vendor_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'make' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'year' => 'required|integer|min:1980|max:' . (date('Y') + 1),
            'color' => 'required|string|max:255',
            'license_plate' => 'required|string|max:255|unique:vehicles,license_plate,' . $vehicle->id,
            'type' => 'required|in:sedan,suv,hatchback,convertible,truck,van',
            'fuel_type' => 'required|in:petrol,diesel,electric,hybrid',
            'transmission' => 'required|in:manual,automatic',
            'seats' => 'required|integer|min:1|max:15',
            'price_per_day' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'features' => 'nullable|array',
            'images' => 'nullable|array',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'location_address' => 'required|string',
            'is_available' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $vehicle->update($validator->validated());

        return response()->json([
            'message' => 'Vehicle updated successfully',
            'vehicle' => $vehicle->load('vendor'),
        ]);
    }

    /**
     * Delete vehicle (Vendor only - own vehicles)
     */
    public function destroy(Request $request, Vehicle $vehicle)
    {
        if (!$request->user()->isVendor() || $vehicle->vendor_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Check if vehicle has active bookings
        $activeBookings = $vehicle->bookings()
            ->whereIn('status', ['pending', 'confirmed', 'ongoing'])
            ->exists();

        if ($activeBookings) {
            return response()->json([
                'message' => 'Cannot delete vehicle with active bookings'
            ], 400);
        }

        $vehicle->delete();

        return response()->json([
            'message' => 'Vehicle deleted successfully'
        ]);
    }

    /**
     * Get vendor's vehicles
     */
    public function vendorVehicles(Request $request)
    {
        if (!$request->user()->isVendor()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $vehicles = Vehicle::with(['reviews', 'bookings'])
            ->where('vendor_id', $request->user()->id)
            ->paginate(10);

        $vehicles->getCollection()->transform(function ($vehicle) {
            $vehicle->average_rating = $vehicle->averageRating();
            $vehicle->review_count = $vehicle->reviews->count();
            $vehicle->booking_count = $vehicle->bookings->count();
            return $vehicle;
        });

        return response()->json($vehicles);
    }
}