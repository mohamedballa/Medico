<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Folio;
use App\Models\FolioSlide;
use Inertia\Inertia;
use Illuminate\Http\Request;

class FolioSlideController extends Controller
{
    public function create(Request $request)
    {
        $folio = Folio::with('module.chapter.topic.subject')
            ->findOrFail($request->query('folio'));

        return Inertia::render('Admin/FolioSlides/Create', [
            'folio' => $folio
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'folio_id' => 'required|exists:folios,id',
            'content'  => 'required|array',
            'order'    => 'required|integer',
        ]);

        FolioSlide::create($validated);

        return redirect()
            ->route('admin.folios.edit', $validated['folio_id'])
            ->with('success', 'Slide created.');
    }

    public function edit(FolioSlide $folioSlide)
    {
        $folioSlide->load('folio.module.chapter.topic.subject');

        return Inertia::render('Admin/FolioSlides/Edit', [
            'slide' => $folioSlide
        ]);
    }

    public function update(Request $request, FolioSlide $folioSlide)
    {
        $validated = $request->validate([
            'content' => 'required|array',
            'order'   => 'required|integer',
        ]);

        $folioSlide->update($validated);

        return redirect()
            ->route('admin.folios.edit', $folioSlide->folio_id)
            ->with('success', 'Slide updated.');
    }

    public function destroy(FolioSlide $folioSlide)
    {
        $folioId = $folioSlide->folio_id;
        $folioSlide->delete();

        return redirect()
            ->route('admin.folios.edit', $folioId)
            ->with('success', 'Slide deleted.');
    }
}