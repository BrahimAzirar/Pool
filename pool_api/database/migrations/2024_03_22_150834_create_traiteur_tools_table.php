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
        Schema::create('traiteur_tools', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tool_id');
            $table->unsignedBigInteger('traiteur_id');
            $table->double("price");
            $table->integer("qty");
            $table->dateTime("dateStart");
            $table->dateTime("dateEnd");
            $table->foreign('tool_id')->references('id')->on('tools')->onDelete('cascade');
            $table->foreign('traiteur_id')->references('id')->on('traiteurs')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('traiteur_tools');
    }
};
