<?php

namespace Tests\Feature;

use App\Models\Question;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_seeding_a_clean_database_succeeds_with_editor_documents_and_no_users(): void
    {
        $this->seed();

        $this->assertDatabaseCount('subjects', 3);
        $this->assertDatabaseCount('topics', 6);
        $this->assertDatabaseCount('chapters', 6);
        $this->assertDatabaseCount('modules', 2);
        $this->assertDatabaseCount('folios', 2);
        $this->assertDatabaseCount('folio_slides', 4);
        $this->assertDatabaseCount('questions', 4);
        $this->assertDatabaseCount('question_choices', 12);
        $this->assertDatabaseCount('flashcards', 3);

        // Admins come from `medico:make-admin`; progress is written by the app.
        $this->assertDatabaseCount('users', 0);
        $this->assertDatabaseCount('user_module_progress', 0);
        $this->assertDatabaseCount('user_streaks', 0);

        Question::all()->each(function (Question $question) {
            $this->assertEditorDocument($question->question_text);
            $this->assertEditorDocument($question->explanation);
            $this->assertContains($question->type, Question::TYPES);
        });
    }

    private function assertEditorDocument(mixed $document): void
    {
        $this->assertIsArray($document);
        $this->assertSame(['time', 'blocks', 'version'], array_keys($document));
        $this->assertSame('2.31.0', $document['version']);
        $this->assertNotEmpty($document['blocks']);
        $this->assertSame('paragraph', $document['blocks'][0]['type']);
        $this->assertNotEmpty($document['blocks'][0]['data']['text']);
    }
}
