<?php

namespace App\Mail;

use App\Models\Vendor;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class VendorRequestMail extends Mailable
{
    use Queueable, SerializesModels;

    public Vendor $vendor;

    public function __construct(Vendor $vendor)
    {
        $this->vendor = $vendor;
    }

    public function build()
    {
        return $this->subject("New Vendor Request: {$this->vendor->store_name}")
            ->view('emails.vendor_request')
            ->with([
                'storeName' => $this->vendor->store_name,
                'storeAddress' => $this->vendor->store_address,
                'phoneNumber' => $this->vendor->phone,
            ]);
    }

}
