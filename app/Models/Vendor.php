<?php

namespace App\Models;

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
    ];

    protected $casts = [
        'status' => VendorStatusEnum::class, // Cast status as enum
        'verified_at' => 'datetime', // Ensure timestamp is properly formatted
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
