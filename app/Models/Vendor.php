<?php

namespace App\Models;

use App\Enum\ProductStatusEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Enum\VendorStatusEnum;
use Illuminate\Support\Facades\DB;

class Vendor extends Model
{
    use HasFactory;

    protected $primaryKey = 'user_id';
    public $incrementing = false;
    protected $keyType = 'string';

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
        'opening_hours',
        'social_media_links',
        'description',
        'email',
    ];

    protected $casts = [
        'status' => VendorStatusEnum::class,
        'verified_at' => 'datetime',
        'opening_hours' => 'array',
        'social_media_links' => 'array',
    ];

    // ✅ Ensures JSON data is always an array
    public function setOpeningHoursAttribute($value)
    {
        // If the value is already an array, we can just encode it as JSON
        $this->attributes['opening_hours'] = is_array($value) ? json_encode($value) : $value;
    }


    public function setSocialMediaLinksAttribute($value)
    {
        if (is_array($value)) {
            $this->attributes['social_media_links'] = json_encode($value); // Encode as JSON if it's an array
        } elseif (is_string($value)) {
            // If it's a string, check if it is already a valid JSON string
            $decoded = json_decode($value, true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $this->attributes['social_media_links'] = $value; // Store as-is if it's a valid JSON string
            } else {
                $this->attributes['social_media_links'] = json_encode([]); // Store as empty JSON array if not valid
            }
        } else {
            $this->attributes['social_media_links'] = json_encode([]); // Default to empty JSON array
        }
    }




    public static function boot()
    {
        parent::boot();

        static::updated(function ($vendor) {
            if ($vendor->isDirty('availability')) {
                if ($vendor->availability === 'out') {
                    // ✅ Ensure ProductStatusEnum::Draft exists before using
                    $vendor->products()->update([
                        'previous_status' => DB::raw('status'),
                        'status' => ProductStatusEnum::Draft ?? 'draft', // Fallback
                    ]);
                } else {
                    $vendor->products()->whereNotNull('previous_status')->update([
                        'status' => DB::raw('previous_status'),
                        'previous_status' => null,
                    ]);
                }
            }
        });
    }

    // 🔹 Vendor belongs to a User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // 🔹 Vendor has many Products
    public function products()
    {
        return $this->hasMany(Product::class, 'vendor_id');
    }

    // 🔹 Vendor has many Stories
    public function stories()
    {
        return $this->hasMany(VendorStory::class, 'vendor_id', 'user_id');
    }
}
