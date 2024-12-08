<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Submission extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'form_id',
        'user_id',
    ];

    /**
     * Get the form where this submission was made.
     */
    public function form(): BelongsTo
    {
        return $this->belongsTo(Form::class);
    }

    /**
     * Get the fields of this submission.
     */
    public function fields(): BelongsToMany
    {
        return $this->belongsToMany(Field::class)
            ->withPivot('value')
            ->withTimestamps();
    }
}
