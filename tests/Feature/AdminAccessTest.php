<?php

namespace Tests\Feature;

use App\Models\Flashcard;
use App\Models\Folio;
use App\Models\FolioSlide;
use App\Models\Question;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Concerns\CreatesCurriculum;
use Tests\TestCase;

class AdminAccessTest extends TestCase
{
    use CreatesCurriculum;
    use RefreshDatabase;

    public function test_guests_are_redirected_to_login(): void
    {
        $this->get(route('admin.dashboard'))->assertRedirect(route('login'));
    }

    public function test_non_admins_get_the_error_page_with_403(): void
    {
        $this->actingAs(User::factory()->create())
            ->get(route('admin.dashboard'))
            ->assertForbidden()
            ->assertInertia(fn ($page) => $page->component('Error')->where('status', 403));
    }

    /** Every /admin/* screen must resolve to an existing Inertia page. */
    public function test_every_admin_screen_renders(): void
    {
        $admin = $this->createAdmin();
        $module = $this->createModule();
        $chapter = $module->chapter;
        $topic = $chapter->topic;
        $subject = $topic->subject;

        $folio = Folio::create(['module_id' => $module->id, 'title' => 'Intro', 'order' => 1]);
        $slide = FolioSlide::create(['folio_id' => $folio->id, 'content' => $this->editorDocument(), 'order' => 1]);
        $question = Question::create([
            'module_id' => $module->id,
            'question_text' => $this->editorDocument(),
            'type' => Question::TYPE_TRUE_FALSE,
            'correct_answer' => 'true',
            'order' => 1,
        ]);
        $flashcard = Flashcard::create(['module_id' => $module->id, 'front' => 'Q', 'back' => 'A', 'order' => 1]);

        $screens = [
            route('admin.dashboard') => 'Admin/Dashboard',
            route('admin.subjects.index') => 'Admin/Subjects/Index',
            route('admin.subjects.create') => 'Admin/Subjects/Create',
            route('admin.subjects.edit', $subject) => 'Admin/Subjects/Edit',
            route('admin.topics.index') => 'Admin/Topics/Index',
            route('admin.topics.create') => 'Admin/Topics/Create',
            route('admin.topics.edit', $topic) => 'Admin/Topics/Edit',
            route('admin.chapters.index') => 'Admin/Chapters/Index',
            route('admin.chapters.create') => 'Admin/Chapters/Create',
            route('admin.chapters.edit', $chapter) => 'Admin/Chapters/Edit',
            route('admin.modules.index') => 'Admin/Modules/Index',
            route('admin.modules.create') => 'Admin/Modules/Create',
            route('admin.modules.edit', $module) => 'Admin/Modules/Edit',
            route('admin.folios.index', ['module' => $module->id]) => 'Admin/Folios/Index',
            route('admin.folios.create', ['module' => $module->id]) => 'Admin/Folios/Create',
            route('admin.folios.edit', $folio) => 'Admin/Folios/Edit',
            route('admin.folio-slides.create', ['folio' => $folio->id]) => 'Admin/FolioSlides/Create',
            route('admin.folio-slides.edit', $slide) => 'Admin/FolioSlides/Edit',
            route('admin.questions.index', ['module' => $module->id]) => 'Admin/Questions/Index',
            route('admin.questions.create', ['module' => $module->id]) => 'Admin/Questions/Create',
            route('admin.questions.edit', $question) => 'Admin/Questions/Edit',
            route('admin.flashcards.index', ['module' => $module->id]) => 'Admin/Flashcards/Index',
            route('admin.flashcards.create', ['module' => $module->id]) => 'Admin/Flashcards/Create',
            route('admin.flashcards.edit', $flashcard) => 'Admin/Flashcards/Edit',
        ];

        foreach ($screens as $url => $component) {
            $this->actingAs($admin)
                ->get($url)
                ->assertOk()
                ->assertInertia(fn ($page) => $page->component($component));

            $this->assertFileExists(
                resource_path("js/Pages/{$component}.jsx"),
                "Inertia page component {$component}.jsx is missing."
            );
        }
    }
}
