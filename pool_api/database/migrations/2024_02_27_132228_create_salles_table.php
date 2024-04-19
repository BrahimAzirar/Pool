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
        Schema::create('salles', function (Blueprint $table) {
            $table->id();
            $table -> unsignedBigInteger("ClientId");
            $table->boolean("is_salle");
            $table->dateTime("date_start");
            $table->dateTime("date_end");
            $table->double("price");
            $table -> string('PaymentMethod', 35);
            $table->timestamps();

            $table->foreign('ClientId')->references('id')->on('clients')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('salles');
    }
};
