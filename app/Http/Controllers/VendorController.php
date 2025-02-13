<?php

namespace App\Http\Controllers;

use App\Enum\RolesEnum;
use App\Http\Resources\ProductListResource;
use App\Mail\VendorRequestMail;
use App\Models\Product;
use App\Models\Vendor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class VendorController extends Controller
{
    public function profile(Vendor $vendor)
    {
        $products = Product::query()
        ->forWebsite()
        ->where('created_by', $vendor->user->id)
        ->paginate();

        return Inertia::render('Vendor/Profile', [
            'vendor' => $vendor,
            'products' => ProductListResource::collection($products),
        ]);
    }
    public function requestVendor(Request $request)
    {
        $user = Auth::user(); // ✅ Get the authenticated user
        $request->validate([
            'store_name' => 'required|string|max:255',
            'store_address' => 'nullable|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|max:225',
        ]);

        $vendor = Vendor::updateOrCreate(
            ['user_id' => Auth::id()],
            [
                'store_name' => $request->store_name,
                'store_address' => $request->store_address,
                'phone' => $request->phone,
                'email' => $request->email,
                'status' => 'pending',
            ]
        );

        if (!$user->hasRole(RolesEnum::Vendor)) {
            $user->assignRole(RolesEnum::Vendor);
        }

        // Send email notification
        Mail::to('admin@example.com')->send(new VendorRequestMail($vendor));

        // Redirect back with the updated vendor data
        return redirect()->back()->with([
            'success' => 'Your vendor request has been submitted.',
            'vendor' => $vendor, // Send back updated vendor data
        ]);

    }
}
