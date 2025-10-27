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
        $modules = Module::with('chapter.subject')->orderBy('order')->get();
        return Inertia::render('Admin/Modules/Index', [
            'modules' => $modules
        ]);
    }

    public function create()
    {
        $chapters = Chapter::with('subject')->orderBy('order')->get();
        return Inertia::render('Admin/Modules/Create', [
            'chapters' => $chapters
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'chapter_id' => 'required|exists:chapters,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'order' => 'required|integer'
        ]);

        Module::create($request->all());

        return redirect()->route('admin.modules.index')
            ->with('success', 'Module created successfully.');
    }

    public function edit(Module $module)
    {
        $module->load('chapter.subject');
        $chapters = Chapter::with('subject')->orderBy('order')->get();

        return Inertia::render('Admin/Modules/Edit', [
            'module' => $module,
            'chapters' => $chapters
        ]);
    }

    public function update(Request $request, Module $module)
    {
        $request->validate([
            'chapter_id' => 'required|exists:chapters,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'order' => 'required|integer'
        ]);

        $module->update($request->all());

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