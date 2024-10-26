<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Salle extends Model
{
    use HasFactory;

    protected $table = "salles";

    protected $fillable = [
        "ClientId",
        "is_salle",
        "date_start",
        "date_end",
        "price"
    ];
}
