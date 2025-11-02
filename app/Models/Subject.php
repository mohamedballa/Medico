<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    protected $fillable = ['name', 'description', 'order'];

    public function chapters()
    {
        return $this->hasMany(Chapter::class)->orderBy('order');
    }
    public function topics()
    {
        return $this->hasMany(Topic::class)->orderBy('order');
    }
}