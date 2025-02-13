<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Enum\RolesEnum;
use App\Enum\VendorStatusEnum;

class EnsureVendorIsApproved
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = auth()->user();




        // Allow only admins OR approved vendors
        if ($user->hasRole(RolesEnum::Admin) ||
            ($user->hasRole(RolesEnum::Vendor) && $user->vendor && $user->vendor->status->value === VendorStatusEnum::Approved->value)) {
            return $next($request);
        }

        abort(403, 'Unauthorized.');
    }
}
