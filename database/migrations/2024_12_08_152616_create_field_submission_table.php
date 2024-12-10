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
        Schema::create('field_submission', function (Blueprint $table) {
            $table->unsignedBigInteger('submission_id');
            $table->unsignedBigInteger('field_id');
            $table->json('value');

            $table->primary(['submission_id', 'field_id']);
            $table->foreign('submission_id')->references('id')->on('submissions')->cascadeOnDelete();
            $table->foreign('field_id')->references('id')->on('fields')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('field_submission');
    }
};
