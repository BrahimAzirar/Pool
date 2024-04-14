<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->string('ClientCIN', 8);
            $table -> string("FirstName", 15);
            $table -> string("LastName", 15);
            $table -> string("Thel", 10);
            $table -> string('Email', 35);
            $table -> boolean('isClient');
            $table -> boolean('isSupplier');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};
