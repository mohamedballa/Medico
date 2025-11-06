<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Module;
use App\Models\Flashcard;
use Inertia\Inertia;
use Illuminate\Http\Request;

class FlashcardController extends Controller
{
    public function index(Request $request)
    {
        $moduleId = $request->query('module');
        $module   = Module::with('chapter.topic.subject')
            ->with(['flashcards' => function ($q) {
                return $q->orderBy('order');
            }])
            ->findOrFail($moduleId);

        return Inertia::render('Admin/Flashcards/Index', ['module' => $module]);
    }

    public function create(Request $request)
    {
        $module = Module::findOrFail($request->query('module'));
        return Inertia::render('Admin/Flashcards/Create', ['module' => $module]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'module_id' => 'required|exists:modules,id',
            'front'     => 'required|string',
            'back'      => 'required|string',
            'hint'      => 'nullable|string',
            'order'     => 'required|integer',
        ]);

        Flashcard::create($validated);

        return redirect()
            ->route('admin.flashcards.index', ['module' => $validated['module_id']])
            ->with('success', 'Flashcard created.');
    }

    public function edit(Flashcard $flashcard)
    {
        $flashcard->load('module.chapter.topic.subject');
        return Inertia::render('Admin/Flashcards/Edit', ['flashcard' => $flashcard]);
    }

    public function update(Request $request, Flashcard $flashcard)
    {
        $validated = $request->validate([
            'front' => 'required|string',
            'back'  => 'required|string',
            'hint'  => 'nullable|string',
            'order' => 'required|integer',
        ]);

        $flashcard->update($validated);

        return redirect()
            ->route('admin.flashcards.index', ['module' => $flashcard->module_id])
            ->with('success', 'Flashcard updated.');
    }

    public function destroy(Flashcard $flashcard)
    {
        $moduleId = $flashcard->module_id;
        $flashcard->delete();

        return redirect()
            ->route('admin.flashcards.index', ['module' => $moduleId])
            ->with('success', 'Flashcard deleted.');
    }
}