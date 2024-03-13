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
        Schema::create('traiteurs', function (Blueprint $table) {
            $table->id();
            $table->string("references_traiteur");
            $table->unsignedBigInteger('tool_id');
            $table->foreign('tool_id')->references('id')->on('tools');
            $table->double("price");
            $table->double("qty");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('traiteurs');
    }
};
