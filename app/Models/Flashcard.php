<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Flashcard extends Model
{
    protected $fillable = ['module_id', 'front', 'back', 'hint', 'order'];

    public function module()
    {
        return $this->belongsTo(Module::class);
    }
}