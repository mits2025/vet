<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Customer;
use Illuminate\Support\Facades\Auth;

class CustomerController extends Controller
{
    public function update(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:225',
            'phone' => 'required|string|max:20',
            'state' => 'required|string|max:255',
            'street' => 'nullable|string|max:255',
            'municipality' => 'required|string|max:255',
            'barangays' => 'required|string|max:255',
            'postal_code' => 'required|string|max:10',
            'country' => 'required|string|max:255',
        ]);

        $customer = Customer::updateOrCreate(
            ['user_id' => Auth::id()],
            $request->all()
        );

        return redirect()->back()->with('success', 'Customer details updated successfully.');
    }
}

