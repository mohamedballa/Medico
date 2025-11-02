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
        Schema::table('chapters', function (Blueprint $table) {
            $table->foreignId('topic_id')->nullable()->after('subject_id')->constrained()->onDelete('cascade');
            $table->dropForeign(['subject_id']);
            $table->dropColumn('subject_id');
        });
    }
    
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('chapters', function (Blueprint $table) {
            $table->foreignId('subject_id')->after('id')->constrained();
            $table->dropForeign(['topic_id']);
            $table->dropColumn('topic_id');
        });
    }
};
