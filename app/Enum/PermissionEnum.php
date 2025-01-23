<?php

namespace App\Enum;

enum PermissionEnum: string
{
    case ApprovedVendors = 'ApprovedVendors';
    case SellProducts = 'SellProducts';
    case BuyProducts = 'BuyProducts';
}
