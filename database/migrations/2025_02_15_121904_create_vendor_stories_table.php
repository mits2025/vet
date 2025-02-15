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
        Schema::create('vendor_stories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vendor_id')
                  ->references('user_id')
                  ->on('vendors')
                  ->constrained()
                  ->onDelete('cascade');
            $table->string('image')->nullable(); // Make image nullable
            $table->string('video')->nullable(); // Add video column
            $table->string('caption')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vendor_stories');
    }
};
