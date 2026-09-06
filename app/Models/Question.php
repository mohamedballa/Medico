<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Question extends Model
{
    public const TYPE_MCQ = 'mcq';

    public const TYPE_TRUE_FALSE = 'true_false';

    /** Single source of truth for the questions.type enum (see migration). */
    public const TYPES = [self::TYPE_MCQ, self::TYPE_TRUE_FALSE];

    protected $fillable = ['module_id', 'question_text', 'type', 'correct_answer', 'explanation', 'order'];

    protected $casts = [
        'question_text' => 'array',
        'explanation' => 'array',
    ];

    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class);
    }

    public function choices(): HasMany
    {
        return $this->hasMany(QuestionChoice::class);
    }
}
