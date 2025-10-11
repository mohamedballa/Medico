<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserModuleProgress extends Model
{
    protected $fillable = ['user_id', 'module_id', 'completed', 'completion_date', 'progress_percentage', 'score'];

    protected $casts = [
        'completed' => 'boolean',
        'completion_date' => 'datetime',
        'score' => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function module()
    {
        return $this->belongsTo(Module::class);
    }
}