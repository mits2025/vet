<?php

namespace App\Http\Controllers;

use App\Mail\VendorRequestMail;
use App\Models\Vendor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;

class VendorController extends Controller
{
    public function requestVendor(Request $request)
    {
        $request->validate([
            'store_name' => 'required|string|max:255',
            'store_address' => 'nullable|string|max:255',
            'phone' => 'required|string|max:20',
        ]);

        $vendor = Vendor::updateOrCreate(
            ['user_id' => Auth::id()],
            [
                'store_name' => $request->store_name,
                'store_address' => $request->store_address,
                'phone' => $request->phone,
                'status' => 'pending',
            ]
        );

        // Send email notification
        Mail::to('hello@example.com')->send(new VendorRequestMail($vendor));

        return back()->with('success', 'Your vendor request has been submitted.');
    }
}
