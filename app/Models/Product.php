<?php

namespace App\Models;

use App\Enum\ProductStatusEnum;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Product extends Model implements HasMedia
{
    use InteractsWithMedia;


    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->width(100)
            ->height(100)
            ->fit('crop', 100, 100); // Ensures a square crop

        $this->addMediaConversion('small')
            ->width(480)
            ->height(480)
            ->fit('crop', 480, 480); // Ensures a square crop

        $this->addMediaConversion('large')
            ->width(1200)
            ->height(1200)
            ->fit('crop', 1200, 1200); // Ensures a square crop
    }


    public function scopeForVendor(\Illuminate\Contracts\Database\Eloquent\Builder $query)
    {
        return $query->where('created_by', auth()->user()->id);
    }

    public function scopePublished (Builder $query): Builder
    {
        return $query->where('status', ProductStatusEnum::Published);
    }
    public function scopeForWebsite (Builder $query): Builder
    {
        return $query->published();
    }
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function variationTypes(): HasMany
    {
        return $this->hasMany(VariationType::class);
    }

    public function variations(): HasMany
    {
        return $this->hasMany(ProductVariation::class, 'product_id');
    }
    public function getPriceForOptions($optionIds = [])
    {
        $optionIds = array_values($optionIds);
        sort($optionIds);
        foreach ($this->variations as $variation) {
            $a = $variation->variation_type_option_ids;
            sort($a);
            if ($optionIds == $a) {
                return $variation->price !== null ? $variation->price : $this->price;
            }
        }
        return $this->price;
    }
}
