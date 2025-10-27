<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Subject;
use Inertia\Inertia;
use Illuminate\Http\Request;

class SubjectController extends Controller
{
    public function index()
    {
        $subjects = Subject::orderBy('order')->get();
        return Inertia::render('Admin/Subjects/Index', [
            'subjects' => $subjects
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Subjects/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'order' => 'required|integer'
        ]);

        Subject::create($request->all());

        return redirect()->route('admin.subjects.index')
            ->with('success', 'Subject created.');
    }

    public function edit(Subject $subject)
    {
        return Inertia::render('Admin/Subjects/Edit', [
            'subject' => $subject
        ]);
    }

    public function update(Request $request, Subject $subject)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'order' => 'required|integer'
        ]);

        $subject->update($request->all());

        return redirect()->route('admin.subjects.index')
            ->with('success', 'Subject updated.');
    }

    public function destroy(Subject $subject)
    {
        $subject->delete();
        return redirect()->route('admin.subjects.index')
            ->with('success', 'Subject deleted.');
    }
}