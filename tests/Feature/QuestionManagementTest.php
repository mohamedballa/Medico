<?php

namespace Tests\Feature;

use App\Models\Question;
use App\Models\QuestionChoice;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Concerns\CreatesCurriculum;
use Tests\TestCase;

class QuestionManagementTest extends TestCase
{
    use CreatesCurriculum;
    use RefreshDatabase;

    private function mcqPayload(int $moduleId, array $overrides = []): array
    {
        return array_replace([
            'module_id' => $moduleId,
            'question_text' => $this->editorDocument('Longest bone?'),
            'type' => Question::TYPE_MCQ,
            'correct_answer' => 'A',
            'explanation' => $this->editorDocument('Femur.'),
            'order' => 1,
            'choices' => [
                ['label' => 'A', 'text' => 'Femur'],
                ['label' => 'B', 'text' => 'Humerus'],
            ],
        ], $overrides);
    }

    public function test_admin_can_store_an_mcq_question_with_choices(): void
    {
        $module = $this->createModule();

        $this->actingAs($this->createAdmin())
            ->post(route('admin.questions.store'), $this->mcqPayload($module->id))
            ->assertRedirect(route('admin.questions.index', ['module' => $module->id]))
            ->assertSessionHas('success');

        $question = Question::firstOrFail();
        $this->assertSame('Longest bone?', $question->question_text['blocks'][0]['data']['text']);
        $this->assertSame('Femur.', $question->explanation['blocks'][0]['data']['text']);
        $this->assertCount(2, $question->choices);
    }

    public function test_store_rejects_string_explanation_and_answers_outside_choices(): void
    {
        $module = $this->createModule();

        $this->actingAs($this->createAdmin())
            ->post(route('admin.questions.store'), $this->mcqPayload($module->id, [
                'explanation' => 'plain string',
                'correct_answer' => 'Z',
            ]))
            ->assertSessionHasErrors(['explanation', 'correct_answer']);

        $this->assertDatabaseCount('questions', 0);
    }

    public function test_store_rejects_unsupported_question_types(): void
    {
        $module = $this->createModule();

        $this->actingAs($this->createAdmin())
            ->post(route('admin.questions.store'), $this->mcqPayload($module->id, ['type' => 'fill_in']))
            ->assertSessionHasErrors('type');
    }

    public function test_update_accepts_editor_documents_and_syncs_choices(): void
    {
        $admin = $this->createAdmin();
        $module = $this->createModule();

        $this->actingAs($admin)->post(route('admin.questions.store'), $this->mcqPayload($module->id));
        $question = Question::with('choices')->firstOrFail();
        [$keep, $drop] = $question->choices->all();

        $this->actingAs($admin)
            ->put(route('admin.questions.update', $question), [
                'question_text' => $this->editorDocument('Updated?'),
                'type' => Question::TYPE_MCQ,
                'correct_answer' => 'C',
                'explanation' => $this->editorDocument('Because.'),
                'order' => 2,
                'choices' => [
                    ['id' => $keep->id, 'label' => 'A', 'text' => 'Femur (edited)'],
                    ['label' => 'C', 'text' => 'Tibia'],
                ],
            ])
            ->assertRedirect(route('admin.questions.index', ['module' => $module->id]));

        $question->refresh();
        $this->assertSame('Updated?', $question->question_text['blocks'][0]['data']['text']);
        $this->assertSame('Femur (edited)', $keep->fresh()->choice_text);
        $this->assertNull($drop->fresh());
        $this->assertEqualsCanonicalizing(['A', 'C'], $question->choices->pluck('choice_label')->all());
    }

    public function test_update_rejects_choice_ids_that_belong_to_another_question(): void
    {
        $admin = $this->createAdmin();
        $module = $this->createModule();

        $this->actingAs($admin)->post(route('admin.questions.store'), $this->mcqPayload($module->id));
        $this->actingAs($admin)->post(route('admin.questions.store'), $this->mcqPayload($module->id, ['order' => 2]));

        [$target, $other] = Question::with('choices')->orderBy('order')->get()->all();
        $foreignChoice = $other->choices->first();

        $this->actingAs($admin)
            ->put(route('admin.questions.update', $target), $this->mcqPayload($module->id, [
                'choices' => [
                    ['id' => $foreignChoice->id, 'label' => 'A', 'text' => 'Hijacked'],
                    ['label' => 'B', 'text' => 'Humerus'],
                ],
            ]))
            ->assertSessionHasErrors('choices.0.id');

        $this->assertSame('Femur', $foreignChoice->fresh()->choice_text);
    }

    public function test_switching_to_true_false_removes_choices(): void
    {
        $admin = $this->createAdmin();
        $module = $this->createModule();

        $this->actingAs($admin)->post(route('admin.questions.store'), $this->mcqPayload($module->id));
        $question = Question::firstOrFail();

        $this->actingAs($admin)
            ->put(route('admin.questions.update', $question), [
                'question_text' => $this->editorDocument(),
                'type' => Question::TYPE_TRUE_FALSE,
                'correct_answer' => 'true',
                'explanation' => null,
                'order' => 1,
                'choices' => [],
            ])
            ->assertSessionHasNoErrors();

        $this->assertSame(0, QuestionChoice::where('question_id', $question->id)->count());
        $this->assertSame(Question::TYPE_TRUE_FALSE, $question->fresh()->type);
    }
}
