<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Chapter extends Model
{
    protected $fillable = ['subject_id', 'name', 'description', 'order'];

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function modules()
    {
        return $this->hasMany(Module::class)->orderBy('order');
    }
}