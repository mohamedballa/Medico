<?php

namespace Database\Seeders;

use App\Models\Chapter;
use App\Models\Flashcard;
use App\Models\Folio;
use App\Models\Module;
use App\Models\Question;
use App\Models\Subject;
use App\Models\Topic;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Sample curriculum for local development.
 *
 * Deliberately seeds no users, progress or streaks: admins are provisioned with
 * `php artisan medico:make-admin {email}` and progress is written by the app.
 */
class MedicoSeeder extends Seeder
{
    private const EDITOR_VERSION = '2.31.0';

    public function run(): void
    {
        DB::transaction(function () {
            $anatomy = $this->subject('Anatomy', 'Study of body structure', 1);
            $physiology = $this->subject('Physiology', 'Study of body functions', 2);
            $biochemistry = $this->subject('Biochemistry', 'Chemical processes in living organisms', 3);

            $musculoskeletal = $this->topic($anatomy, 'Musculoskeletal', 'Bones and muscles', 1);
            $this->topic($anatomy, 'Nervous System', 'Brain and nerves', 2);

            $cardiovascular = $this->topic($physiology, 'Cardiovascular', 'Heart and blood vessels', 1);
            $this->topic($physiology, 'Respiratory', 'Lungs and breathing', 2);

            $enzymology = $this->topic($biochemistry, 'Enzymology', 'Enzyme structure and function', 1);
            $this->topic($biochemistry, 'Metabolic Pathways', 'Energy and biosynthesis', 2);

            $skeletal = $this->chapter($musculoskeletal, 'Skeletal System', 1);
            $this->chapter($musculoskeletal, 'Muscular System', 2);
            $this->chapter($cardiovascular, 'Circulatory System', 1);
            $this->chapter($cardiovascular, 'Respiratory System', 2);
            $this->chapter($enzymology, 'Enzymes', 1);
            $this->chapter($enzymology, 'Metabolism', 2);

            $upperLimb = $this->module($skeletal, 'Bones of Upper Limb', 1);
            $this->module($skeletal, 'Bones of Lower Limb', 2);

            $this->seedFolios($upperLimb);
            $this->seedQuestions($upperLimb);
            $this->seedFlashcards($upperLimb);
        });
    }

    private function seedFolios(Module $module): void
    {
        $intro = Folio::create(['module_id' => $module->id, 'title' => 'Intro to Bones', 'order' => 1]);
        $intro->slides()->createMany([
            ['content' => $this->document('Slide 1: Bone structure'), 'order' => 1],
            ['content' => $this->document('Slide 2: Functions of the skeleton'), 'order' => 2],
        ]);

        $advanced = Folio::create(['module_id' => $module->id, 'title' => 'Advanced Bones', 'order' => 2]);
        $advanced->slides()->createMany([
            ['content' => $this->document('Slide 1: Ossification'), 'order' => 1],
            ['content' => $this->document('Slide 2: Quiz preparation'), 'order' => 2],
        ]);
    }

    private function seedQuestions(Module $module): void
    {
        $this->mcq($module, 1, 'What is the longest bone in the human body?', 'A', 'The femur is the longest and strongest bone.', [
            'A' => 'Femur', 'B' => 'Humerus', 'C' => 'Tibia', 'D' => 'Radius',
        ]);
        $this->mcq($module, 2, 'Which bone is found in the upper arm?', 'B', 'The humerus extends from shoulder to elbow.', [
            'A' => 'Femur', 'B' => 'Humerus', 'C' => 'Tibia', 'D' => 'Fibula',
        ]);
        $this->mcq($module, 3, 'Which bone is in the lower leg?', 'C', 'The tibia is the weight-bearing bone of the lower leg.', [
            'A' => 'Ulna', 'B' => 'Radius', 'C' => 'Tibia', 'D' => 'Clavicle',
        ]);

        Question::create([
            'module_id' => $module->id,
            'question_text' => $this->document('The clavicle is part of the upper limb.'),
            'type' => Question::TYPE_TRUE_FALSE,
            'correct_answer' => 'true',
            'explanation' => $this->document('The clavicle forms part of the pectoral girdle.'),
            'order' => 4,
        ]);
    }

    private function seedFlashcards(Module $module): void
    {
        Flashcard::insert([
            ['module_id' => $module->id, 'front' => 'Longest bone?', 'back' => 'Femur', 'hint' => null, 'order' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['module_id' => $module->id, 'front' => 'Arm bone?', 'back' => 'Humerus', 'hint' => 'Upper arm', 'order' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['module_id' => $module->id, 'front' => 'Leg bone?', 'back' => 'Tibia', 'hint' => 'Weight-bearing', 'order' => 3, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    /** @param  array<string, string>  $choices  label => text */
    private function mcq(Module $module, int $order, string $text, string $answer, string $explanation, array $choices): void
    {
        $question = Question::create([
            'module_id' => $module->id,
            'question_text' => $this->document($text),
            'type' => Question::TYPE_MCQ,
            'correct_answer' => $answer,
            'explanation' => $this->document($explanation),
            'order' => $order,
        ]);

        $question->choices()->createMany(
            collect($choices)->map(fn ($text, $label) => ['choice_label' => $label, 'choice_text' => $text])->values()->all()
        );
    }

    /** Minimal Editor.js document with a single paragraph block. */
    private function document(string $text): array
    {
        return [
            'time' => now()->getTimestampMs(),
            'blocks' => [['type' => 'paragraph', 'data' => ['text' => $text]]],
            'version' => self::EDITOR_VERSION,
        ];
    }

    private function subject(string $name, string $description, int $order): Subject
    {
        return Subject::create(['name' => $name, 'description' => $description, 'order' => $order]);
    }

    private function topic(Subject $subject, string $name, string $description, int $order): Topic
    {
        return Topic::create(['subject_id' => $subject->id, 'name' => $name, 'description' => $description, 'order' => $order]);
    }

    private function chapter(Topic $topic, string $name, int $order): Chapter
    {
        return Chapter::create(['topic_id' => $topic->id, 'name' => $name, 'order' => $order]);
    }

    private function module(Chapter $chapter, string $name, int $order): Module
    {
        return Module::create(['chapter_id' => $chapter->id, 'name' => $name, 'order' => $order]);
    }
}
