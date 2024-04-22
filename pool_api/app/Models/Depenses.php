<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Depenses extends Model
{
    use HasFactory;

    protected $table = "depenses";

    protected $fillable = ["name", "persone_id", "payement_method", "price", "expenseDate"];
}
