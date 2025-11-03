<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Chapter;
use App\Models\Subject;
use App\Models\Topic;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ChapterController extends Controller
{
    public function index()
    {
        $subjects = Subject::with([
            'topics' => fn($q) => $q->orderBy('order'),
            'topics.chapters' => fn($q) => $q->orderBy('order')
        ])
        ->orderBy('order')
        ->get();

    return Inertia::render('Admin/Chapters/Index', [
        'subjects' => $subjects,  
    ]);
    }

    public function create()
    {
        $topics = Topic::with('subject')->orderBy('order')->get();
        return Inertia::render('Admin/Chapters/Create', ['topics' => $topics]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'topic_id' => 'required|exists:topics,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'order' => 'required|integer',
        ]);

        Chapter::create($validated);
        return redirect()->route('admin.chapters.index')->with('success', 'Chapter created.');
    }

    public function edit(Chapter $chapter)
    {
        $chapter->load('topic.subject');
        $topics = Topic::with('subject')->orderBy('order')->get();
        return Inertia::render('Admin/Chapters/Edit', ['chapter' => $chapter, 'topics' => $topics]);
    }

    public function update(Request $request, Chapter $chapter)
    {
        $validated = $request->validate([
            'topic_id' => 'required|exists:topics,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'order' => 'required|integer',
        ]);

        $chapter->update($validated);
        return redirect()->route('admin.chapters.index')->with('success', 'Chapter updated.');
    }

    public function destroy(Chapter $chapter)
    {
        $chapter->delete();
        return redirect()->route('admin.chapters.index')->with('success', 'Chapter deleted.');
    }
}