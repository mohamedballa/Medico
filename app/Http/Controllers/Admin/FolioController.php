<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Folio;
use App\Models\Module;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class FolioController extends Controller
{
    public function index(Request $request): Response
    {
        $module = Module::with('chapter.topic.subject')
            ->with(['folios' => fn ($q) => $q->orderBy('order')->with(['slides' => fn ($s) => $s->orderBy('order')])])
            ->findOrFail($request->query('module'));

        return Inertia::render('Admin/Folios/Index', ['module' => $module]);
    }

    public function create(Request $request): Response
    {
        $module = Module::findOrFail($request->query('module'));

        return Inertia::render('Admin/Folios/Create', ['module' => $module]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'module_id' => 'required|integer|exists:modules,id',
            ...$this->folioRules(),
        ]);

        DB::transaction(function () use ($validated) {
            $folio = Folio::create([
                'module_id' => $validated['module_id'],
                'title'     => $validated['title'],
                'order'     => $validated['order'],
            ]);

            $folio->slides()->createMany(
                array_map(fn (array $slide) => [
                    'content' => $slide['content'],
                    'order'   => $slide['order'],
                ], $validated['slides'])
            );
        });

        return redirect()
            ->route('admin.folios.index', ['module' => $validated['module_id']])
            ->with('success', 'Folio created.');
    }

    public function edit(Folio $folio): Response
    {
        $folio->load([
            'module.chapter.topic.subject',
            'slides' => fn ($q) => $q->orderBy('order'),
        ]);

        return Inertia::render('Admin/Folios/Edit', ['folio' => $folio]);
    }

    public function update(Request $request, Folio $folio): RedirectResponse
    {
        $validated = $request->validate([
            ...$this->folioRules(),
            // Only slides that already belong to this folio may be referenced.
            'slides.*.id' => [
                'nullable',
                'integer',
                Rule::exists('folio_slides', 'id')->where('folio_id', $folio->id),
            ],
        ]);

        DB::transaction(function () use ($validated, $folio) {
            $folio->update([
                'title' => $validated['title'],
                'order' => $validated['order'],
            ]);

            $keptIds = [];

            foreach ($validated['slides'] as $slide) {
                $attributes = [
                    'content' => $slide['content'],
                    'order'   => $slide['order'],
                ];

                if (! empty($slide['id'])) {
                    $folio->slides()->whereKey($slide['id'])->update($attributes);
                    $keptIds[] = (int) $slide['id'];
                } else {
                    $keptIds[] = $folio->slides()->create($attributes)->id;
                }
            }

            $folio->slides()->whereKeyNot($keptIds)->delete();
        });

        return redirect()
            ->route('admin.folios.index', ['module' => $folio->module_id])
            ->with('success', 'Folio updated.');
    }

    public function destroy(Folio $folio): RedirectResponse
    {
        $moduleId = $folio->module_id;
        $folio->delete();

        return redirect()
            ->route('admin.folios.index', ['module' => $moduleId])
            ->with('success', 'Folio deleted.');
    }

    /**
     * Validation rules shared by store() and update().
     *
     * @return array<string, string>
     */
    private function folioRules(): array
    {
        return [
            'title'            => 'required|string|max:255',
            'order'            => 'required|integer|min:0',
            'slides'           => 'required|array|min:1',
            'slides.*.content' => 'required|array',
            'slides.*.order'   => 'required|integer|min:0',
        ];
    }
}
