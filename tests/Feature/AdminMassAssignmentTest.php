<?php

namespace Tests\Feature;

use App\Models\Chapter;
use App\Models\Flashcard;
use App\Models\Folio;
use App\Models\Module;
use App\Models\Question;
use App\Models\Subject;
use App\Models\Topic;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Concerns\CreatesCurriculum;
use Tests\TestCase;

/**
 * Every admin store/update must persist only the validated fields.
 * Unexpected input (a bogus column, a forged primary key) is ignored.
 */
class AdminMassAssignmentTest extends TestCase
{
    use CreatesCurriculum;
    use RefreshDatabase;

    private const NOISE = ['is_published' => 1, 'id' => 999, 'created_at' => '2000-01-01 00:00:00'];

    public function test_subject_controller_ignores_unexpected_fields(): void
    {
        $this->assertStoreAndUpdateIgnoreNoise(
            storeRoute: 'admin.subjects.store',
            updateRoute: 'admin.subjects.update',
            model: Subject::class,
            payload: ['name' => 'Anatomy', 'description' => 'Body', 'order' => 1],
        );
    }

    public function test_topic_controller_ignores_unexpected_fields(): void
    {
        $subject = Subject::create(['name' => 'Anatomy', 'order' => 1]);

        $this->assertStoreAndUpdateIgnoreNoise(
            storeRoute: 'admin.topics.store',
            updateRoute: 'admin.topics.update',
            model: Topic::class,
            payload: ['subject_id' => $subject->id, 'name' => 'Nervous System', 'order' => 1],
        );
    }

    public function test_chapter_controller_ignores_unexpected_fields(): void
    {
        $topic = $this->createModule()->chapter->topic;

        $this->assertStoreAndUpdateIgnoreNoise(
            storeRoute: 'admin.chapters.store',
            updateRoute: 'admin.chapters.update',
            model: Chapter::class,
            payload: ['topic_id' => $topic->id, 'name' => 'Cranial Nerves', 'order' => 2],
            preexisting: 1,
        );
    }

    public function test_module_controller_ignores_unexpected_fields(): void
    {
        $chapter = $this->createModule()->chapter;

        $this->assertStoreAndUpdateIgnoreNoise(
            storeRoute: 'admin.modules.store',
            updateRoute: 'admin.modules.update',
            model: Module::class,
            payload: ['chapter_id' => $chapter->id, 'name' => 'Skull', 'description' => null, 'order' => 2],
            preexisting: 1,
        );
    }

    public function test_flashcard_controller_ignores_unexpected_fields(): void
    {
        $module = $this->createModule();

        $this->assertStoreAndUpdateIgnoreNoise(
            storeRoute: 'admin.flashcards.store',
            updateRoute: 'admin.flashcards.update',
            model: Flashcard::class,
            payload: ['module_id' => $module->id, 'front' => 'Q', 'back' => 'A', 'hint' => null, 'order' => 1],
        );
    }

    public function test_folio_controller_ignores_unexpected_fields(): void
    {
        $module = $this->createModule();

        $this->assertStoreAndUpdateIgnoreNoise(
            storeRoute: 'admin.folios.store',
            updateRoute: 'admin.folios.update',
            model: Folio::class,
            payload: [
                'module_id' => $module->id,
                'title' => 'Intro',
                'order' => 1,
                'slides' => [['content' => $this->editorDocument(), 'order' => 1]],
            ],
        );
    }

    public function test_question_controller_ignores_unexpected_fields(): void
    {
        $module = $this->createModule();

        $this->assertStoreAndUpdateIgnoreNoise(
            storeRoute: 'admin.questions.store',
            updateRoute: 'admin.questions.update',
            model: Question::class,
            payload: [
                'module_id' => $module->id,
                'question_text' => $this->editorDocument('Q?'),
                'type' => Question::TYPE_TRUE_FALSE,
                'correct_answer' => 'true',
                'explanation' => null,
                'order' => 1,
                'choices' => [],
            ],
        );
    }

    /**
     * @param  class-string<Model>  $model
     * @param  array<string, mixed>  $payload  A valid payload; NOISE is merged on top.
     * @param  int  $preexisting  Rows of $model created by the fixture before the request.
     */
    private function assertStoreAndUpdateIgnoreNoise(
        string $storeRoute,
        string $updateRoute,
        string $model,
        array $payload,
        int $preexisting = 0,
    ): void {
        $admin = $this->createAdmin();
        $table = (new $model)->getTable();

        $this->actingAs($admin)
            ->post(route($storeRoute), [...$payload, ...self::NOISE])
            ->assertSessionHasNoErrors()
            ->assertRedirect();

        $this->assertDatabaseCount($table, $preexisting + 1);

        /** @var Model $record */
        $record = $model::query()->latest('id')->firstOrFail();
        $this->assertNotSame(999, $record->getKey(), 'Forged primary key must be ignored.');
        $this->assertFalse($record->getConnection()->getSchemaBuilder()->hasColumn($table, 'is_published'));
        $this->assertTrue($record->created_at->isCurrentYear(), 'Forged timestamps must be ignored.');

        $before = $record->getAttributes();

        $this->actingAs($admin)
            ->put(route($updateRoute, $record), [...$payload, ...self::NOISE, 'id' => 998])
            ->assertSessionHasNoErrors()
            ->assertRedirect();

        $record->refresh();
        $this->assertSame($before['id'], $record->getKey(), 'Primary key must not change on update.');
        $this->assertSame($before['created_at'], $record->getAttributes()['created_at']);
        $this->assertDatabaseCount($table, $preexisting + 1);
    }
}
