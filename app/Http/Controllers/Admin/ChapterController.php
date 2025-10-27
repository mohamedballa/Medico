<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Chapter;
use App\Models\Subject;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ChapterController extends Controller
{
    public function index()
    {
        $chapters = Chapter::with('subject')->orderBy('order')->get();
        return Inertia::render('Admin/Chapters/Index', [
            'chapters' => $chapters
        ]);
    }

    public function create()
    {
        $subjects = Subject::orderBy('order')->get();
        return Inertia::render('Admin/Chapters/Create', [
            'subjects' => $subjects
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'subject_id' => 'required|exists:subjects,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'order' => 'required|integer'
        ]);

        Chapter::create($request->all());

        return redirect()->route('admin.chapters.index')
            ->with('success', 'Chapter created successfully.');
    }

    public function edit(Chapter $chapter)
    {
        $chapter->load('subject');
        $subjects = Subject::orderBy('order')->get();

        return Inertia::render('Admin/Chapters/Edit', [
            'chapter' => $chapter,
            'subjects' => $subjects
        ]);
    }

    public function update(Request $request, Chapter $chapter)
    {
        $request->validate([
            'subject_id' => 'required|exists:subjects,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'order' => 'required|integer'
        ]);

        $chapter->update($request->all());

        return redirect()->route('admin.chapters.index')
            ->with('success', 'Chapter updated successfully.');
    }

    public function destroy(Chapter $chapter)
    {
        $chapter->delete();
        return redirect()->route('admin.chapters.index')
            ->with('success', 'Chapter deleted.');
    }
}