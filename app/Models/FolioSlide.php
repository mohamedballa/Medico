<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FolioSlide extends Model
{
    protected $fillable = ['folio_id', 'content', 'order'];

    protected $casts = [
        'content' => 'array', // Casts jsonb to PHP array
    ];

    public function folio()
    {
        return $this->belongsTo(Folio::class);
    }
}