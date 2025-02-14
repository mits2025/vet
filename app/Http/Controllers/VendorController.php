<?php

namespace App\Http\Controllers;

use App\Enum\RolesEnum;
use App\Enum\VendorStatusEnum;
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
        $user = Auth::user();

        $request->validate([
            'store_name' => 'required|string|max:255',
            'store_address' => 'nullable|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|max:225',
            'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Ensure image is valid
            'description' => 'nullable|string',
            'opening_hours' => 'nullable|array',
            'social_media_links' => 'nullable|array',
        ]);

        // Handle file upload
        $profileImagePath = null;
        if ($request->hasFile('profile_image')) {
            $profileImagePath = $request->file('profile_image')->store('vendor_images', 'public'); // Store in storage/app/public/vendor_images
        }

        $vendor = Vendor::updateOrCreate(
            ['user_id' => Auth::id()],
            [
                'store_name' => $request->store_name,
                'address' => $request->address,
                'phone' => $request->phone,
                'email' => $request->email,
                'profile_image' => $profileImagePath, // Store file path instead of string
                'description' => $request->description,
                'opening_hours' => json_encode($request->opening_hours),
                'social_media_links' => json_encode($request->social_media_links),
                'status' => VendorStatusEnum::Pending->value,
            ]
        );

        if (!$user->hasRole(RolesEnum::Vendor)) {
            $user->assignRole(RolesEnum::Vendor);
        }

        // Send email notification
        Mail::to('admin@example.com')->send(new VendorRequestMail($vendor));

        return redirect()->back()->with([
            'success' => 'Your vendor request has been submitted.',
            'vendor' => $vendor,
        ]);

    }


}
