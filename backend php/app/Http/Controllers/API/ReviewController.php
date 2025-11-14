<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    /**
     * Get reviews for a vehicle
     */
    public function index(Request $request, $vehicleId)
    {
        $reviews = Review::with('user')
            ->where('vehicle_id', $vehicleId)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json($reviews);
    }

    /**
     * Store a new review
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'booking_id' => 'required|exists:bookings,id',
            'rating' => 'required|integer|between:1,5',
            'comment' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $booking = Booking::with('vehicle')->findOrFail($request->booking_id);

        // Check if user owns this booking
        if ($booking->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Check if booking is completed
        if ($booking->status !== 'completed') {
            return response()->json([
                'message' => 'Can only review completed bookings'
            ], 400);
        }

        // Check if review already exists
        if ($booking->review) {
            return response()->json([
                'message' => 'Review already exists for this booking'
            ], 400);
        }

        $review = Review::create([
            'user_id' => $request->user()->id,
            'vehicle_id' => $booking->vehicle_id,
            'booking_id' => $booking->id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        return response()->json([
            'message' => 'Review created successfully',
            'review' => $review->load(['user', 'vehicle']),
        ], 201);
    }

    /**
     * Update a review
     */
    public function update(Request $request, Review $review)
    {
        if ($review->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'rating' => 'required|integer|between:1,5',
            'comment' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $review->update($validator->validated());

        return response()->json([
            'message' => 'Review updated successfully',
            'review' => $review->load(['user', 'vehicle']),
        ]);
    }

    /**
     * Delete a review
     */
    public function destroy(Request $request, Review $review)
    {
        if ($review->user_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $review->delete();

        return response()->json([
            'message' => 'Review deleted successfully'
        ]);
    }
}