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
            $table->string('phone'); // Correct column name
            $table->string('email');
            $table->string('store_name');
            $table->string('store_address')->nullable();
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
