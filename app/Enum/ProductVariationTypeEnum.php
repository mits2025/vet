<?php

namespace App\Enum;

enum ProductVariationTypeEnum: string
{
    case Select = 'Select';
    case Description = 'Description';
    case Image = 'Image';

    public static function labels(): array
    {
        return [
            self::Select->value => __('Select'),
            self::Description->value => __('Description'),
            self::Image->value => __('image'),
        ];
    }

}
