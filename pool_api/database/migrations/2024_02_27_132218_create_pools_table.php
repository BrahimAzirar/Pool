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
        Schema::create('pools', function (Blueprint $table) {
            $table->id();
            $table->integer("offer");
            $table->unsignedBigInteger("SelectedClient") -> nullable();
            $table->integer("add_person")->default(1);
            $table->date("poolDate");
            $table -> string("PaymentMethod", 35)->charset('utf8mb4');

            $table->foreign('SelectedClient')->references('id')->on('clients')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pools');
    }
};
