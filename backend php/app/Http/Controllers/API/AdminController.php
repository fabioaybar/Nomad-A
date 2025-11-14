<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
{
    /**
     * Middleware to ensure admin access
     */
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            if (!$request->user()->isAdmin()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
            return $next($request);
        });
    }

    /**
     * Get dashboard statistics
     */
    public function dashboard()
    {
        $stats = [
            'total_users' => User::where('role', 'user')->count(),
            'total_vendors' => User::where('role', 'vendor')->count(),
            'total_vehicles' => Vehicle::count(),
            'approved_vehicles' => Vehicle::where('status', 'approved')->count(),
            'pending_vehicles' => Vehicle::where('status', 'pending')->count(),
            'total_bookings' => Booking::count(),
            'total_revenue' => Booking::where('status', 'completed')->sum('total_amount'),
            'recent_bookings' => Booking::with(['user', 'vehicle.vendor'])
                ->orderBy('created_at', 'desc')
                ->take(5)
                ->get(),
        ];

        return response()->json($stats);
    }

    /**
     * Get all users with pagination
     */
    public function users(Request $request)
    {
        $query = User::query();

        if ($request->role) {
            $query->where('role', $request->role);
        }

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        $users = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($users);
    }

    /**
     * Update user status
     */
    public function updateUserStatus(Request $request, User $user)
    {
        $validator = Validator::make($request->all(), [
            'is_active' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user->update(['is_active' => $request->is_active]);

        return response()->json([
            'message' => 'User status updated successfully',
            'user' => $user,
        ]);
    }

    /**
     * Get all vehicles for admin management
     */
    public function vehicles(Request $request)
    {
        $query = Vehicle::with(['vendor', 'reviews']);

        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->vendor_id) {
            $query->where('vendor_id', $request->vendor_id);
        }

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('make', 'like', '%' . $request->search . '%')
                  ->orWhere('model', 'like', '%' . $request->search . '%')
                  ->orWhere('license_plate', 'like', '%' . $request->search . '%');
            });
        }

        $vehicles = $query->orderBy('created_at', 'desc')->paginate(15);

        $vehicles->getCollection()->transform(function ($vehicle) {
            $vehicle->average_rating = $vehicle->averageRating();
            $vehicle->review_count = $vehicle->reviews->count();
            return $vehicle;
        });

        return response()->json($vehicles);
    }

    /**
     * Update vehicle status (approve/reject)
     */
    public function updateVehicleStatus(Request $request, Vehicle $vehicle)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,approved,rejected',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $vehicle->update(['status' => $request->status]);

        return response()->json([
            'message' => 'Vehicle status updated successfully',
            'vehicle' => $vehicle->load('vendor'),
        ]);
    }

    /**
     * Get all bookings for admin management
     */
    public function bookings(Request $request)
    {
        $query = Booking::with(['user', 'vehicle.vendor', 'payment']);

        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->user_id) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->vendor_id) {
            $query->whereHas('vehicle', function ($q) use ($request) {
                $q->where('vendor_id', $request->vendor_id);
            });
        }

        $bookings = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($bookings);
    }
}