<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Topic;
use App\Models\Subject;
use Inertia\Inertia;
use Illuminate\Http\Request;

class TopicController extends Controller
{
    public function index()
    {
        $subjects = Subject::with(['topics' => function ($query) {
            $query->orderBy('order');
        }])->orderBy('order')->get();
    
        return Inertia::render('Admin/Topics/Index', [
            'subjects' => $subjects
        ]);
    }

    public function create()
    {
        $subjects = Subject::orderBy('order')->get();
        return Inertia::render('Admin/Topics/Create', ['subjects' => $subjects]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject_id' => 'required|exists:subjects,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'order' => 'required|integer',
        ]);

        Topic::create($validated);
        return redirect()->route('admin.topics.index')->with('success', 'Topic created.');
    }

    public function edit(Topic $topic)
    {
        $topic->load('subject');
        $subjects = Subject::orderBy('order')->get();
        return Inertia::render('Admin/Topics/Edit', ['topic' => $topic, 'subjects' => $subjects]);
    }

    public function update(Request $request, Topic $topic)
    {
        $validated = $request->validate([
            'subject_id' => 'required|exists:subjects,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'order' => 'required|integer',
        ]);

        $topic->update($validated);
        return redirect()->route('admin.topics.index')->with('success', 'Topic updated.');
    }

    public function destroy(Topic $topic)
    {
        $topic->delete();
        return redirect()->route('admin.topics.index')->with('success', 'Topic deleted.');
    }
}