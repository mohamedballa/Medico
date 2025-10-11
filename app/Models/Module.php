<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Module extends Model
{
    protected $fillable = ['chapter_id', 'name', 'description', 'order'];

    public function chapter()
    {
        return $this->belongsTo(Chapter::class);
    }

    public function folios()
    {
        return $this->hasMany(Folio::class)->orderBy('order');
    }

    public function questions()
    {
        return $this->hasMany(Question::class)->orderBy('order');
    }

    public function flashcards()
    {
        return $this->hasMany(Flashcard::class)->orderBy('order');
    }
}