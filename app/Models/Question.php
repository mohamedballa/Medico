<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $fillable = ['module_id', 'question_text', 'type', 'correct_answer', 'explanation', 'order'];
    protected $casts = [
        'question_text' => 'array',
        'explanation' => 'array',
    ];
    public function module()
    {
        return $this->belongsTo(Module::class);
    }

    public function choices()
    {
        return $this->hasMany(QuestionChoice::class);
    }
}