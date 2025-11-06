<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Module;
use App\Models\Folio;
use App\Models\FolioSlide;
use Inertia\Inertia;
use Illuminate\Http\Request;

class FolioController extends Controller
{
    public function index(Request $request)
    {
        $moduleId = $request->query('module');
        $module   = Module::with('chapter.topic.subject')
            ->with(['folios' => function ($q) {
                return $q->orderBy('order')
                         ->with(['slides' => function ($q) {
                             return $q->orderBy('order');
                         }]);
            }])
            ->findOrFail($moduleId);

        return Inertia::render('Admin/Folios/Index', [
            'module' => $module,
        ]);
    }

    public function create(Request $request)
    {
        $module = Module::findOrFail($request->query('module'));
        return Inertia::render('Admin/Folios/Create', ['module' => $module]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'module_id'        => 'required|exists:modules,id',
            'title'            => 'required|string|max:255',
            'order'            => 'required|integer',
            'slides'           => 'required|array|min:1',
            'slides.*.content' => 'required|array',
            'slides.*.order'   => 'required|integer',
        ]);

        $folio = Folio::create([
            'module_id' => $validated['module_id'],
            'title'     => $validated['title'],
            'order'     => $validated['order'],
        ]);

        foreach ($validated['slides'] as $slideData) {
            FolioSlide::create([
                'folio_id' => $folio->id,
                'content'  => $slideData['content'],
                'order'    => $slideData['order'],
            ]);
        }

        return redirect()
            ->route('admin.folios.index', ['module' => $validated['module_id']])
            ->with('success', 'Folio created.');
    }

    public function edit(Folio $folio)
    {
        $folio->load(['module.chapter.topic.subject',
            'slides' => function ($q) { return $q->orderBy('order'); }]);

        return Inertia::render('Admin/Folios/Edit', ['folio' => $folio]);
    }

    public function update(Request $request, Folio $folio)
    {
        $validated = $request->validate([
            'title'            => 'required|string|max:255',
            'order'            => 'required|integer',
            'slides'           => 'required|array|min:1',
            'slides.*.id'      => 'nullable|exists:folio_slides,id',
            'slides.*.content' => 'required|array',
            'slides.*.order'   => 'required|integer',
        ]);

        $folio->update([
            'title' => $validated['title'],
            'order' => $validated['order'],
        ]);

        $existingIds = $folio->slides->pluck('id')->toArray();

        foreach ($validated['slides'] as $slideData) {
            if (isset($slideData['id'])) {
                FolioSlide::where('id', $slideData['id'])
                    ->update([
                        'content' => $slideData['content'],
                        'order'   => $slideData['order'],
                    ]);
                $existingIds = array_diff($existingIds, [$slideData['id']]);
            } else {
                FolioSlide::create([
                    'folio_id' => $folio->id,
                    'content'  => $slideData['content'],
                    'order'    => $slideData['order'],
                ]);
            }
        }

        FolioSlide::whereIn('id', $existingIds)->delete();

        return redirect()
            ->route('admin.folios.index', ['module' => $folio->module_id])
            ->with('success', 'Folio updated.');
    }

    public function destroy(Folio $folio)
    {
        $moduleId = $folio->module_id;
        $folio->delete();

        return redirect()
            ->route('admin.folios.index', ['module' => $moduleId])
            ->with('success', 'Folio deleted.');
    }
}