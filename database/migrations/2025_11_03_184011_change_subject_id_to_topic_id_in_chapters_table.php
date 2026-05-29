<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
	{
   	 Schema::table('chapters', function (Blueprint $table) {
        if (Schema::hasColumn('chapters', 'subject_id')) {
       		     $table->dropColumn('subject_id');
       		 }
        if (!Schema::hasColumn('chapters', 'topic_id')) {
    	       	     $table->foreignId('topic_id')->after('id')->constrained();
        	}
	    });
	}

    public function down()
    {
        Schema::table('chapters', function (Blueprint $table) {
            $table->dropForeign(['topic_id']);
            $table->dropColumn('topic_id');

            $table->foreignId('subject_id')->after('id')->constrained();
        });
    }
};
