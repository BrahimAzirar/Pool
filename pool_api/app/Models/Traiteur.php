<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Traiteur extends Model
{
    use HasFactory;

    protected $table = "traiteurs";

    protected $fillable = ["references_traiteur", "tool_id", "price", "qty"];
}
