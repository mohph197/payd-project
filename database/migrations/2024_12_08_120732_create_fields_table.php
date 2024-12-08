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
        Schema::create('fields', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('category', ['general', 'identity', 'bank-related']);
            $table->integer('order');
            $table->enum('type', ['text', 'number', 'email', 'phone', 'password', 'currency', 'textarea', 'dropdown', 'checkbox', 'radio']);
            $table->boolean('required')->default(false);
            $table->json('options')->nullable();

            $table->foreignId('form_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fields');
    }
};
