<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Module;
use App\Models\Question;
use App\Models\QuestionChoice;
use Inertia\Inertia;
use Illuminate\Http\Request;

class QuestionController extends Controller
{
    public function index(Request $request)
    {
        $moduleId = $request->query('module');
        $module   = Module::with('chapter.topic.subject')
            ->with(['questions' => function ($q) {
                return $q->orderBy('order')
                         ->with('choices');
            }])
            ->findOrFail($moduleId);

        return Inertia::render('Admin/Questions/Index', ['module' => $module]);
    }

    public function create(Request $request)
    {
        $module = Module::findOrFail($request->query('module'));
        return Inertia::render('Admin/Questions/Create', ['module' => $module]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'module_id'      => 'required|exists:modules,id',
            'question_text'  => 'required|string',
            'type'           => 'required|in:mcq,true_false',
            'correct_answer' => 'required|string',
            'explanation'    => 'nullable|string',
            'order'          => 'required|integer',
            'choices'        => 'required_if:type,mcq|array|min:2',
            'choices.*.label'=> 'required|string',
            'choices.*.text' => 'required|string',
        ]);

        $question = Question::create([
            'module_id'      => $validated['module_id'],
            'question_text'  => $validated['question_text'],
            'type'           => $validated['type'],
            'correct_answer' => $validated['correct_answer'],
            'explanation'    => $validated['explanation'],
            'order'          => $validated['order'],
        ]);

        if ($validated['type'] === 'mcq') {
            foreach ($validated['choices'] as $choice) {
                QuestionChoice::create([
                    'question_id'  => $question->id,
                    'choice_label' => $choice['label'],
                    'choice_text'  => $choice['text'],
                ]);
            }
        }

        return redirect()
            ->route('admin.questions.index', ['module' => $validated['module_id']])
            ->with('success', 'Question created.');
    }

    public function edit(Question $question)
    {
        $question->load(['module.chapter.topic.subject',
            'choices' => function ($q) { return $q->orderBy('id'); }]);

        return Inertia::render('Admin/Questions/Edit', ['question' => $question]);
    }

    public function update(Request $request, Question $question)
    {
        $validated = $request->validate([
            'question_text'  => 'required|string',
            'type'           => 'required|in:mcq,true_false',
            'correct_answer' => 'required|string',
            'explanation'    => 'nullable|string',
            'order'          => 'required|integer',
            'choices'        => 'required_if:type,mcq|array|min:2',
            'choices.*.id'   => 'nullable|exists:question_choices,id',
            'choices.*.label'=> 'required|string',
            'choices.*.text' => 'required|string',
        ]);

        $question->update([
            'question_text'  => $validated['question_text'],
            'type'           => $validated['type'],
            'correct_answer' => $validated['correct_answer'],
            'explanation'    => $validated['explanation'],
            'order'          => $validated['order'],
        ]);

        if ($validated['type'] === 'mcq') {
            $existingIds = $question->choices->pluck('id')->toArray();

            foreach ($validated['choices'] as $choice) {
                if (isset($choice['id'])) {
                    QuestionChoice::where('id', $choice['id'])
                        ->update([
                            'choice_label' => $choice['label'],
                            'choice_text'  => $choice['text'],
                        ]);
                    $existingIds = array_diff($existingIds, [$choice['id']]);
                } else {
                    QuestionChoice::create([
                        'question_id'  => $question->id,
                        'choice_label' => $choice['label'],
                        'choice_text'  => $choice['text'],
                    ]);
                }
            }
            QuestionChoice::whereIn('id', $existingIds)->delete();
        } else {
            $question->choices()->delete();
        }

        return redirect()
            ->route('admin.questions.index', ['module' => $question->module_id])
            ->with('success', 'Question updated.');
    }

    public function destroy(Question $question)
    {
        $moduleId = $question->module_id;
        $question->delete();

        return redirect()
            ->route('admin.questions.index', ['module' => $moduleId])
            ->with('success', 'Question deleted.');
    }
}