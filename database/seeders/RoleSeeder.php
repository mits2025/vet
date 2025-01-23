<?php

namespace Database\Seeders;

use App\Enum\PermissionEnum;
use App\Enum\RolesEnum;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $userRole = Role::create(['name' => RolesEnum::User->value]);
        $vendorRole = Role::create(['name' => RolesEnum::Vendor->value]);
        $adminRole = Role::create(['name' => RolesEnum::Admin->value]);

        $approveVendors = Permission::create([
            'name' => PermissionEnum::ApprovedVendors->value,
        ]);

        $sellProducts = Permission::create([
            'name' => PermissionEnum::SellProducts->value,
        ]);

        $buyProducts = Permission::create([
            'name' => PermissionEnum::BuyProducts->value,
        ]);

        $userRole->syncPermissions([$buyProducts,]);
        $vendorRole->syncPermissions([$sellProducts, $buyProducts,]);
        $adminRole->syncPermissions([
            $approveVendors, $sellProducts, $buyProducts,
        ]);
    }
}
