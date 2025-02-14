<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Enum\VendorStatusEnum;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vendors', function (Blueprint $table) {
            $table->bigInteger('user_id')->unsigned()->unique(); // Ensure each user is a vendor only once
            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->cascadeOnDelete(); // Delete vendor if user is deleted

            $table->enum('status', array_column(VendorStatusEnum::cases(), 'value'))
                ->default(VendorStatusEnum::Pending->value); // Default to pending

            $table->string('store_name');
            $table->string('profile_image')->nullable(); // Store vendor profile image
            $table->text('description')->nullable(); // Vendor description
            $table->string('address')->nullable(); // Address (renamed for consistency)
            $table->string('phone');
            $table->string('email');

            $table->json('opening_hours')->nullable(); // JSON structure for opening hours
            $table->json('social_media_links')->nullable(); // JSON structure for social media

            $table->string('cover_image')->nullable();
            $table->enum('availability', ['available', 'out'])->default('available');

            $table->text('rejection_reason')->nullable(); // Store rejection reason
            $table->timestamp('verified_at')->nullable(); // Timestamp for approval

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vendors');
    }
};
