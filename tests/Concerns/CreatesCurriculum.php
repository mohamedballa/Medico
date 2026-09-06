<?php

namespace Tests\Concerns;

use App\Models\Chapter;
use App\Models\Module;
use App\Models\Subject;
use App\Models\Topic;
use App\Models\User;

trait CreatesCurriculum
{
    protected function createAdmin(): User
    {
        return User::factory()->admin()->create();
    }

    /** Builds the full Subject → Topic → Chapter → Module chain and returns the module. */
    protected function createModule(): Module
    {
        $subject = Subject::create(['name' => 'Anatomy', 'order' => 1]);
        $topic = Topic::create(['subject_id' => $subject->id, 'name' => 'Musculoskeletal', 'order' => 1]);
        $chapter = Chapter::create(['topic_id' => $topic->id, 'name' => 'Skeletal System', 'order' => 1]);

        return Module::create(['chapter_id' => $chapter->id, 'name' => 'Bones of Upper Limb', 'order' => 1]);
    }

    /** Minimal valid Editor.js document. */
    protected function editorDocument(string $text = 'Lorem ipsum'): array
    {
        return ['time' => 1, 'blocks' => [['type' => 'paragraph', 'data' => ['text' => $text]]], 'version' => '2.31.0'];
    }
}
