<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Module;
use App\Models\Chapter;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ModuleController extends Controller
{
    public function index()
    {
            $subjects = \App\Models\Subject::with([
                'topics' => function ($q) {
                    return $q->orderBy('order');
                },
                'topics.chapters' => function ($q) {
                    return $q->orderBy('order');
                },
                'topics.chapters.modules' => function ($q) {
                    return $q->orderBy('order')
                        ->withCount(['folios', 'questions', 'flashcards'])
                        ->with(['folios' => function ($q) {
                            return $q->select('id', 'module_id', 'title');
                        }]);
                }
            ])
                ->orderBy('order')
                ->get();
        

            return Inertia::render('Admin/Modules/Index', [
                'subjects' => $subjects
    ]);
    }

    public function create()
    {
        $chapters = Chapter::with(['topic.subject'])
        ->orderBy('order')
        ->get();

        return Inertia::render('Admin/Modules/Create', [
            'chapters' => $chapters
    ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'chapter_id' => 'required|exists:chapters,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'order' => 'required|integer'
        ]);

        Module::create($validated);

        return redirect()->route('admin.modules.index')
            ->with('success', 'Module created successfully.');
    }

    public function edit(Module $module)
    {
        $module->load('chapter.topic.subject');
        $chapters = Chapter::with(['topic.subject'])->orderBy('order')->get();

        return Inertia::render('Admin/Modules/Edit', [
            'module'   => $module,
            'chapters' => $chapters
    ]);
    }

    public function update(Request $request, Module $module)
    {
        $validated = $request->validate([
            'chapter_id' => 'required|exists:chapters,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'order' => 'required|integer'
        ]);

        $module->update($validated);

        return redirect()->route('admin.modules.index')
            ->with('success', 'Module updated successfully.');
    }

    public function destroy(Module $module)
    {
        $module->delete();
        return redirect()->route('admin.modules.index')
            ->with('success', 'Module deleted.');
    }
}