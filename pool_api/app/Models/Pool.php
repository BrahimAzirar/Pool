<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pool extends Model
{
    use HasFactory;

    protected $table = "pools";

    protected $fillable = ["references_pool", "total", "offer", "add_person"];
}
