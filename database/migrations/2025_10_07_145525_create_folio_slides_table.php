<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('folio_slides', function (Blueprint $table) {
            $table->id();
            $table->foreignId('folio_id')->constrained()->onDelete('cascade');
            $table->jsonb('content'); // Use jsonb for PostgreSQL: e.g., {"text": "Slide content", "interactive": {...}}
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('folio_slides');
    }
};
