<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Folio extends Model
{
    protected $fillable = ['module_id', 'title', 'order'];

    public function module()
    {
        return $this->belongsTo(Module::class);
    }

    public function slides()
    {
        return $this->hasMany(FolioSlide::class)->orderBy('order');
    }
}