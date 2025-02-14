<?php

namespace App\Models;

use App\Enum\ProductStatusEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Enum\VendorStatusEnum;

class Vendor extends Model
{
    use HasFactory;

    protected $primaryKey = 'user_id'; // Tells Eloquent that 'user_id' is the primary key
    public $incrementing = false; // Because 'user_id' is not auto-incrementing
    protected $keyType = 'string'; // If 'user_id' is not an integer (optional)

    protected $fillable = [
        'user_id',
        'status',
        'phone',
        'store_name',
        'store_address',
        'cover_image',
        'rejection_reason',
        'verified_at',
        'availability',
        'status',
    ];

    protected $casts = [
        'status' => VendorStatusEnum::class, // Cast status as enum
        'verified_at' => 'datetime', // Ensure timestamp is properly formatted
        'opening_hours' => 'array',
        'social_media_links' => 'array',
    ];

    public static function boot()
    {
        parent::boot();

        static::updated(function ($vendor) {
            if ($vendor->isDirty('availability')) { // Check if availability changed
                if ($vendor->availability === 'out') {
                    // Store previous status before unpublishing
                    $vendor->products()->update([
                        'previous_status' => \DB::raw('status'), // Save current status
                        'status' => ProductStatusEnum::Draft,   // Unpublish the product
                    ]);
                } else {
                    // Restore previous status when availability changes back to "available"
                    $vendor->products()->whereNotNull('previous_status')->update([
                        'status' => \DB::raw('previous_status'), // Restore the saved status
                        'previous_status' => null, // Clear previous status
                    ]);
                }
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class, 'vendor_id');
    }

}
