<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VendorStory extends Model
{
    use HasFactory;

    protected $fillable = ['vendor_id', 'image', 'video', 'caption'];

    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }
}
