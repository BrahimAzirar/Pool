<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CalculPreson extends Model
{

    use HasFactory;

    protected $table = "calcul_presons";

    protected $fillable = ["persone_id", "credit", "cash", "khlstou", "credit_client", "credit_fournisseuse", "a_paye", "borrow_me", "credit_for_him"];

}
