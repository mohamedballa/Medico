<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Chapter extends Model
{
    protected $fillable = ['topic_id', 'name', 'description', 'order'];

    public function topic()
    {
        return $this->belongsTo(Topic::class);
    }
    public function modules()
    {
        return $this->hasMany(Module::class)->orderBy('order');
    }
}