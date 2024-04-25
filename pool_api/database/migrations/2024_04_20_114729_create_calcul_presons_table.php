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
        Schema::create('calcul_presons', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('persone_id');
            $table->double('credit')->default(0);
            $table->double('cash')->default(0);
            $table->double('credit_client')->default(0);
            $table->double('credit_fournisseuse')->default(0);
            $table->double('borrow_me')->default(0);
            $table->double('credit_for_him')->default(0);
            $table->double('khlstou')->default(0);
            $table->double('a_paye')->default(0);
            $table->foreign('persone_id')->references('id')->on('clients')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('calcul_presons');
    }
};
