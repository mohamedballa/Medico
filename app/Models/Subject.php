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
}