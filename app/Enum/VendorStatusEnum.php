<?php

namespace App\Enum;

enum VendorStatusEnum: string
{
    case Pending = 'pending';
    case Approved = 'approved';
    case Rejected = 'rejected';

    public static function labels(): array
    {
        return [
            self::Pending->value => __('Pending'),
            self::Approved->value => __('Approved'),
            self::Rejected->value => __('Rejected'),
        ];
    }
    public static function colors(): array
    {
        return [
            self::Pending->value => 'gray',    // Pending status -> gray color
            self::Approved->value => 'success', // Approved status -> success color
            self::Rejected->value => 'danger',  // Rejected status -> danger color
        ];
    }
}

