<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Benefice extends Model
{
    use HasFactory;

    protected $table = "benefices";

    protected $fillable = ["price"];

}
