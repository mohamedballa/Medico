<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Subject;
use App\Models\Topic;
use App\Models\Chapter;
use App\Models\Module;
use App\Models\Folio;
use App\Models\FolioSlide;
use App\Models\Question;
use App\Models\QuestionChoice;
use App\Models\Flashcard;
use App\Models\UserModuleProgress;
use App\Models\UserStreak;


class MedicoSeeder extends Seeder

{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $testUser = User::create([
            'name' => 'Test Admin',
            'email' => 'admin@example.com',
            'password' => 'password',
            'is_admin' => true,
            'email_verified_at' => now(),
        ]);

       // Subjects (3)
       $subject1 = Subject::create([
        'name' => 'Anatomy',
        'description' => 'Study of body structure',
        'order' => 1,
    ]);
    $subject2 = Subject::create([
        'name' => 'Physiology',
        'description' => 'Study of body functions',
        'order' => 2,
    ]);
    $subject3 = Subject::create([
        'name' => 'Biochemistry',
        'description' => 'Chemical processes in living organisms',
        'order' => 3,
    ]);


    // 3. Topics (2 per subject)
    $topic1_1 = Topic::create([
        'subject_id' => $subject1->id,
        'name' => 'Musculoskeletal',
        'description' => 'Bones and muscles',
        'order' => 1,
    ]);
    $topic1_2 = Topic::create([
        'subject_id' => $subject1->id,
        'name' => 'Nervous System',
        'description' => 'Brain and nerves',
        'order' => 2,
    ]);

    $topic2_1 = Topic::create([
        'subject_id' => $subject2->id,
        'name' => 'Cardiovascular',
        'description' => 'Heart and blood vessels',
        'order' => 1,
    ]);
    $topic2_2 = Topic::create([
        'subject_id' => $subject2->id,
        'name' => 'Respiratory',
        'description' => 'Lungs and breathing',
        'order' => 2,
    ]);

    $topic3_1 = Topic::create([
        'subject_id' => $subject3->id,
        'name' => 'Enzymology',
        'description' => 'Enzyme structure and function',
        'order' => 1,
    ]);
    $topic3_2 = Topic::create([
        'subject_id' => $subject3->id,
        'name' => 'Metabolic Pathways',
        'description' => 'Energy and biosynthesis',
        'order' => 2,
    ]);


    // Chapters (2 per subject)
    $chapter1_1 = Chapter::create([
        'topic_id' => $topic1_1->id,
        'name' => 'Skeletal System',
        'order' => 1,
    ]);
    $chapter1_2 = Chapter::create([
        'topic_id' => $topic1_1->id,
        'name' => 'Muscular System',
        'order' => 2,
    ]);
    $chapter2_1 = Chapter::create([
        'topic_id' => $topic2_1->id,
        'name' => 'Circulatory System',
        'order' => 1,
    ]);
    $chapter2_2 = Chapter::create([
        'topic_id' => $topic2_1->id,
        'name' => 'Respiratory System',
        'order' => 2,
    ]);
    $chapter3_1 = Chapter::create([
        'topic_id' => $topic3_1->id,
        'name' => 'Enzymes',
        'order' => 1,
    ]);
    $chapter3_2 = Chapter::create([
        'topic_id' => $topic3_1->id,
        'name' => 'Metabolism',
        'order' => 2,
    ]);

    // Modules (2 for the first chapter, for brevity)
    $module1_1_1 = Module::create([
        'chapter_id' => $chapter1_1->id,
        'name' => 'Bones of Upper Limb',
        'order' => 1,
    ]);
    $module1_1_2 = Module::create([
        'chapter_id' => $chapter1_1->id,
        'name' => 'Bones of Lower Limb',
        'order' => 2,
    ]);

    // Folios and Slides (2 folios per module, 2 slides each)
    $folio1 = Folio::create([
        'module_id' => $module1_1_1->id,
        'title' => 'Intro to Bones',
        'order' => 1,
    ]);
    FolioSlide::create([
        'folio_id' => $folio1->id,
        'content' => ['text' => 'Slide 1: Bone structure'],
        'order' => 1,
    ]);
    FolioSlide::create([
        'folio_id' => $folio1->id,
        'content' => ['text' => 'Slide 2: Functions', 'interactive' => ['type' => 'fill_in_blank', 'prompt' => 'The bone is called ___.', 'answer' => 'humerus']],
        'order' => 2,
    ]);
    $folio2 = Folio::create([
        'module_id' => $module1_1_1->id,
        'title' => 'Advanced Bones',
        'order' => 2,
    ]);
    FolioSlide::create([
        'folio_id' => $folio2->id,
        'content' => ['text' => 'Slide 1: Details'],
        'order' => 1,
    ]);
    FolioSlide::create([
        'folio_id' => $folio2->id,
        'content' => ['text' => 'Slide 2: Quiz prep'],
        'order' => 2,
    ]);

    // Questions and Choices (3 questions per module, each MCQ with 4 choices)
    $question1 = Question::create([
        'module_id' => $module1_1_1->id,
        'question_text' => 'What is the longest bone?',
        'type' => 'mcq',
        'correct_answer' => 'A',
        'explanation' => 'Femur is the longest.',
        'order' => 1,
    ]);
    QuestionChoice::create([
        'question_id' => $question1->id,
        'choice_label' => 'A',
        'choice_text' => 'Femur',
    ]);
    QuestionChoice::create([
        'question_id' => $question1->id,
        'choice_label' => 'B',
        'choice_text' => 'Humerus',
    ]);
    QuestionChoice::create([
        'question_id' => $question1->id,
        'choice_label' => 'C',
        'choice_text' => 'Tibia',
    ]);
    QuestionChoice::create([
        'question_id' => $question1->id,
        'choice_label' => 'D',
        'choice_text' => 'Radius',
    ]);

    $question2 = Question::create([
        'module_id' => $module1_1_1->id,
        'question_text' => 'Bone in arm?',
        'type' => 'mcq',
        'correct_answer' => 'B',
        'explanation' => 'Humerus is in the upper arm.',
        'order' => 2,
    ]);
    QuestionChoice::create([
        'question_id' => $question2->id,
        'choice_label' => 'A',
        'choice_text' => 'Femur',
    ]);
    QuestionChoice::create([
        'question_id' => $question2->id,
        'choice_label' => 'B',
        'choice_text' => 'Humerus',
    ]);
    QuestionChoice::create([
        'question_id' => $question2->id,
        'choice_label' => 'C',
        'choice_text' => 'Tibia',
    ]);
    QuestionChoice::create([
        'question_id' => $question2->id,
        'choice_label' => 'D',
        'choice_text' => 'Fibula',
    ]);

    $question3 = Question::create([
        'module_id' => $module1_1_1->id,
        'question_text' => 'Leg bone?',
        'type' => 'mcq',
        'correct_answer' => 'C',
        'explanation' => 'Tibia is in the lower leg.',
        'order' => 3,
    ]);
    QuestionChoice::create([
        'question_id' => $question3->id,
        'choice_label' => 'A',
        'choice_text' => 'Ulna',
    ]);
    QuestionChoice::create([
        'question_id' => $question3->id,
        'choice_label' => 'B',
        'choice_text' => 'Radius',
    ]);
    QuestionChoice::create([
        'question_id' => $question3->id,
        'choice_label' => 'C',
        'choice_text' => 'Tibia',
    ]);
    QuestionChoice::create([
        'question_id' => $question3->id,
        'choice_label' => 'D',
        'choice_text' => 'Clavicle',
    ]);

    // Flashcards (3 per module)
    Flashcard::create([
        'module_id' => $module1_1_1->id,
        'front' => 'Longest bone?',
        'back' => 'Femur',
        'order' => 1,
    ]);
    Flashcard::create([
        'module_id' => $module1_1_1->id,
        'front' => 'Arm bone?',
        'back' => 'Humerus',
        'order' => 2,
    ]);
    Flashcard::create([
        'module_id' => $module1_1_1->id,
        'front' => 'Leg bone?',
        'back' => 'Tibia',
        'order' => 3,
    ]);

    // User Progress (assume user_id 1 exists; 3 entries)
    UserModuleProgress::create([
        'user_id' => $testUser->id,
        'module_id' => $module1_1_1->id,
        'completed' => true,
        'completion_date' => now(),
        'progress_percentage' => 100,
        'score' => 95.5,
    ]);
    UserModuleProgress::create([
        'user_id' => $testUser->id,
        'module_id' => $module1_1_2->id,
        'completed' => false,
        'progress_percentage' => 50,
    ]);
    UserModuleProgress::create([
        'user_id' => $testUser->id,
        'module_id' => $module1_1_1->id,
        'completed' => true,
        'completion_date' => now()->subDay(),
        'progress_percentage' => 100,
        'score' => 80.0,
    ]);

    // User Streaks (1 per user)
    UserStreak::create([
        'user_id' => $testUser->id,
        'current_streak' => 2,
        'longest_streak' => 5,
        'last_completion_date' => now()->subDay(),
    ]);
    }
}
