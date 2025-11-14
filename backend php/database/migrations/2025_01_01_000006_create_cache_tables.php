<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('news_cache', function (Blueprint $table) {
            $table->id();
            $table->string('location');
            $table->json('articles');
            $table->timestamp('expires_at');
            $table->timestamps();
        });

        Schema::create('currency_cache', function (Blueprint $table) {
            $table->id();
            $table->string('base_currency', 3);
            $table->json('rates');
            $table->timestamp('expires_at');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('news_cache');
        Schema::dropIfExists('currency_cache');
    }
};