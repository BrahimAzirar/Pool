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
        Schema::create('traiteur_totals', function (Blueprint $table) {
            $table->id();
            $table -> unsignedBigInteger("ClientId");
            $table -> unsignedBigInteger("traiteur_id");
            $table -> double("Advance") -> nullable();
            $table -> double("Total");
            $table -> string("PaymentMethod", 35);
            $table->foreign('traiteur_id')->references('id')->on('traiteurs')->onDelete('cascade');
            $table->foreign('ClientId')->references('id')->on('clients')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('traiteur_total');
    }
};
