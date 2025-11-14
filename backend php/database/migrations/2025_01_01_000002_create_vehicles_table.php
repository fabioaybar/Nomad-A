<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vendor_id')->constrained('users')->onDelete('cascade');
            $table->string('make');
            $table->string('model');
            $table->year('year');
            $table->string('color');
            $table->string('license_plate')->unique();
            $table->enum('type', ['sedan', 'suv', 'hatchback', 'convertible', 'truck', 'van']);
            $table->enum('fuel_type', ['petrol', 'diesel', 'electric', 'hybrid']);
            $table->enum('transmission', ['manual', 'automatic']);
            $table->integer('seats');
            $table->decimal('price_per_day', 8, 2);
            $table->text('description')->nullable();
            $table->json('features')->nullable(); // AC, GPS, etc.
            $table->json('images')->nullable();
            $table->decimal('latitude', 10, 8);
            $table->decimal('longitude', 11, 8);
            $table->string('location_address');
            $table->boolean('is_available')->default(true);
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};