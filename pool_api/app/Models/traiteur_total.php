<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class traiteur_total extends Model
{
    use HasFactory;

    protected $fillable = [
        'traiteur_id',
        'Advance',
        'Total',
        'Payed',
    ];
}
