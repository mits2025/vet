<?php

namespace App\Http\Controllers;

use App\Models\VendorStory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use FFMpeg\FFMpeg;

class VendorStoryController extends Controller
{
    public function index($vendorId)
    {
        $stories = VendorStory::where('vendor_id', $vendorId)->latest()->get();
        return response()->json($stories);
    }

    public function store(Request $request)
    {
        $request->validate([
            'media' => 'required|file|mimetypes:image/jpeg,image/png,video/mp4|max:51200', // 50MB
            'caption' => 'nullable|string|max:255',
        ]);

        $file = $request->file('media');
        $path = $file->store('vendor_stories', 'public');

        if (str_contains($file->getMimeType(), 'video')) {
            $ffprobe = \FFMpeg\FFProbe::create();
            $duration = $ffprobe->format(Storage::path("public/{$path}"))->get('duration');
            if ($duration > 15) {
                Storage::delete("public/{$path}");
                return response()->json(['error' => 'Video must be 15 seconds or less'], 422);
            }
        }

        $vendor = Auth::user()->vendor;
        $story = VendorStory::create([
            'vendor_id' => $vendor->id,
            str_contains($file->getMimeType(), 'video') ? 'video' : 'image' => $path,
            'caption' => $request->caption,
        ]);

        return response()->json($story, 201);
    }
    public function upload(Request $request)
    {
        $request->validate([
            'vendor_id' => 'required|exists:vendors,user_id',
            'file' => 'required|file|mimes:jpeg,png,jpg,mp4,mov|max:20480',
            'caption' => 'nullable|string',
        ]);

        $filePath = $request->file('file')->store('stories', 'public');

        $story = VendorStory::create([
            'vendor_id' => $request->vendor_id,
            'image' => $request->file('file')->getClientOriginalExtension() !== 'mp4' ? $filePath : null,
            'video' => $request->file('file')->getClientOriginalExtension() === 'mp4' ? $filePath : null,
            'caption' => $request->caption,
        ]);

        return response()->json(['message' => 'Story uploaded', 'story' => $story]);
    }

}
