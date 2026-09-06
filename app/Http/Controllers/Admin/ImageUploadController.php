<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ImageUploadController extends Controller
{
    /**
     * Accepts an Editor.js image upload and returns its public URL.
     */
    public function __invoke(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'image' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        // store() generates a random filename, so user-supplied names never reach the disk.
        $path = $validated['image']->store('editor', 'public');

        return response()->json(['url' => Storage::disk('public')->url($path)]);
    }
}
