<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Module;
use App\Models\Question;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class QuestionController extends Controller
{
    public function index(Request $request): Response
    {
        $module = Module::with('chapter.topic.subject')
            ->with(['questions' => fn ($q) => $q->orderBy('order')->with('choices')])
            ->findOrFail($request->query('module'));

        return Inertia::render('Admin/Questions/Index', ['module' => $module]);
    }

    public function create(Request $request): Response
    {
        $module = Module::findOrFail($request->query('module'));

        return Inertia::render('Admin/Questions/Create', ['module' => $module]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'module_id' => 'required|integer|exists:modules,id',
            ...$this->questionRules($request),
        ]);

        DB::transaction(function () use ($validated) {
            $question = Question::create([
                'module_id'      => $validated['module_id'],
                'question_text'  => $validated['question_text'],
                'type'           => $validated['type'],
                'correct_answer' => $validated['correct_answer'],
                'explanation'    => $validated['explanation'] ?? null,
                'order'          => $validated['order'],
            ]);

            if ($validated['type'] === Question::TYPE_MCQ) {
                $question->choices()->createMany(
                    array_map(fn (array $choice) => [
                        'choice_label' => $choice['label'],
                        'choice_text'  => $choice['text'],
                    ], $validated['choices'])
                );
            }
        });

        return redirect()
            ->route('admin.questions.index', ['module' => $validated['module_id']])
            ->with('success', 'Question created.');
    }

    public function edit(Question $question): Response
    {
        $question->load([
            'module.chapter.topic.subject',
            'choices' => fn ($q) => $q->orderBy('id'),
        ]);

        return Inertia::render('Admin/Questions/Edit', ['question' => $question]);
    }

    public function update(Request $request, Question $question): RedirectResponse
    {
        $validated = $request->validate([
            ...$this->questionRules($request),
            // Only choices that already belong to this question may be referenced.
            'choices.*.id' => [
                'nullable',
                'integer',
                Rule::exists('question_choices', 'id')->where('question_id', $question->id),
            ],
        ]);

        DB::transaction(function () use ($validated, $question) {
            $question->update([
                'question_text'  => $validated['question_text'],
                'type'           => $validated['type'],
                'correct_answer' => $validated['correct_answer'],
                'explanation'    => $validated['explanation'] ?? null,
                'order'          => $validated['order'],
            ]);

            if ($validated['type'] !== Question::TYPE_MCQ) {
                $question->choices()->delete();

                return;
            }

            $keptIds = [];

            foreach ($validated['choices'] as $choice) {
                $attributes = [
                    'choice_label' => $choice['label'],
                    'choice_text'  => $choice['text'],
                ];

                if (! empty($choice['id'])) {
                    $question->choices()->whereKey($choice['id'])->update($attributes);
                    $keptIds[] = (int) $choice['id'];
                } else {
                    $keptIds[] = $question->choices()->create($attributes)->id;
                }
            }

            $question->choices()->whereKeyNot($keptIds)->delete();
        });

        return redirect()
            ->route('admin.questions.index', ['module' => $question->module_id])
            ->with('success', 'Question updated.');
    }

    public function destroy(Question $question): RedirectResponse
    {
        $moduleId = $question->module_id;
        $question->delete();

        return redirect()
            ->route('admin.questions.index', ['module' => $moduleId])
            ->with('success', 'Question deleted.');
    }

    /**
     * Validation rules shared by store() and update().
     *
     * @return array<string, mixed>
     */
    private function questionRules(Request $request): array
    {
        $isMcq = $request->input('type') === Question::TYPE_MCQ;
        $choices = $request->input('choices');
        $choiceLabels = is_array($choices) ? array_column($choices, 'label') : [];

        return [
            'question_text'        => 'required|array',
            'question_text.blocks' => 'required|array|min:1',
            'type'                 => ['required', Rule::in(Question::TYPES)],
            // The answer must reference one of the submitted choices (MCQ) or be a boolean literal.
            'correct_answer'       => $isMcq
                ? ['required', 'string', 'max:255', Rule::in($choiceLabels)]
                : ['required', Rule::in(['true', 'false'])],
            'explanation'          => 'nullable|array',
            'explanation.blocks'   => 'nullable|array',
            'order'                => 'required|integer|min:0',
            'choices'              => $isMcq ? 'required|array|min:2' : 'nullable|array|max:0',
            'choices.*.label'      => 'required_with:choices|string|max:10',
            'choices.*.text'       => 'required_with:choices|string|max:1000',
        ];
    }
}
