<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class ExternalApiController extends Controller
{
    /**
     * Get location-based news
     */
    public function getNews(Request $request)
    {
        $location = $request->get('location', 'general');
        $cacheKey = "news_{$location}";

        // Check cache first
        $cachedNews = Cache::remember($cacheKey, 3600, function () use ($location) {
            try {
                $response = Http::get('https://newsapi.org/v2/everything', [
                    'apiKey' => env('NEWS_API_KEY'),
                    'q' => $location === 'general' ? 'travel' : $location,
                    'sortBy' => 'publishedAt',
                    'pageSize' => 10,
                    'language' => 'en',
                ]);

                if ($response->successful()) {
                    return $response->json()['articles'];
                }
            } catch (\Exception $e) {
                \Log::error('News API error: ' . $e->getMessage());
            }

            return [];
        });

        // Store in database cache for persistence
        DB::table('news_cache')->updateOrInsert(
            ['location' => $location],
            [
                'articles' => json_encode($cachedNews),
                'expires_at' => now()->addHour(),
                'updated_at' => now(),
            ]
        );

        return response()->json([
            'location' => $location,
            'articles' => $cachedNews,
        ]);
    }

    /**
     * Get currency exchange rates
     */
    public function getCurrencyRates(Request $request)
    {
        $baseCurrency = $request->get('base', 'USD');
        $cacheKey = "currency_{$baseCurrency}";

        // Check cache first
        $cachedRates = Cache::remember($cacheKey, 3600, function () use ($baseCurrency) {
            try {
                $response = Http::get("https://api.exchangerate-api.com/v4/latest/{$baseCurrency}");

                if ($response->successful()) {
                    return $response->json()['rates'];
                }
            } catch (\Exception $e) {
                \Log::error('Currency API error: ' . $e->getMessage());
            }

            // Fallback rates
            return [
                'EUR' => 0.85,
                'GBP' => 0.73,
                'JPY' => 110.0,
                'CAD' => 1.25,
                'AUD' => 1.35,
            ];
        });

        // Store in database cache for persistence
        DB::table('currency_cache')->updateOrInsert(
            ['base_currency' => $baseCurrency],
            [
                'rates' => json_encode($cachedRates),
                'expires_at' => now()->addHour(),
                'updated_at' => now(),
            ]
        );

        return response()->json([
            'base' => $baseCurrency,
            'rates' => $cachedRates,
        ]);
    }

    /**
     * Get Google Maps geocoding data
     */
    public function geocode(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'address' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $response = Http::get('https://maps.googleapis.com/maps/api/geocode/json', [
                'address' => $request->address,
                'key' => env('GOOGLE_MAPS_API_KEY'),
            ]);

            if ($response->successful()) {
                $data = $response->json();
                
                if ($data['status'] === 'OK' && count($data['results']) > 0) {
                    $result = $data['results'][0];
                    
                    return response()->json([
                        'latitude' => $result['geometry']['location']['lat'],
                        'longitude' => $result['geometry']['location']['lng'],
                        'formatted_address' => $result['formatted_address'],
                    ]);
                }
            }
        } catch (\Exception $e) {
            \Log::error('Geocoding error: ' . $e->getMessage());
        }

        return response()->json([
            'message' => 'Unable to geocode address'
        ], 400);
    }

    /**
     * Get reverse geocoding (address from coordinates)
     */
    public function reverseGeocode(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $response = Http::get('https://maps.googleapis.com/maps/api/geocode/json', [
                'latlng' => $request->latitude . ',' . $request->longitude,
                'key' => env('GOOGLE_MAPS_API_KEY'),
            ]);

            if ($response->successful()) {
                $data = $response->json();
                
                if ($data['status'] === 'OK' && count($data['results']) > 0) {
                    return response()->json([
                        'address' => $data['results'][0]['formatted_address'],
                    ]);
                }
            }
        } catch (\Exception $e) {
            \Log::error('Reverse geocoding error: ' . $e->getMessage());
        }

        return response()->json([
            'message' => 'Unable to get address from coordinates'
        ], 400);
    }
}