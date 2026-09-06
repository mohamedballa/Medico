<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Aligns the questions.type enum with what the application actually accepts
 * (QuestionController validation / App\Models\Question::TYPES).
 *
 * Old set: mcq, fill_in, short_answer
 * New set: mcq, true_false
 */
return new class extends Migration
{
    private const TABLE = 'questions';

    private const CONSTRAINT = 'questions_type_check';

    private const NEW_TYPES = ['mcq', 'true_false'];

    private const OLD_TYPES = ['mcq', 'fill_in', 'short_answer'];

    public function up(): void
    {
        $this->assertNoRowsOutside(self::NEW_TYPES);
        $this->replaceEnum(self::NEW_TYPES);
    }

    public function down(): void
    {
        $this->assertNoRowsOutside(self::OLD_TYPES);
        $this->replaceEnum(self::OLD_TYPES);
    }

    /**
     * Refuse to run if data would violate the new constraint. Silently
     * remapping question types would corrupt content, so a human must decide.
     */
    private function assertNoRowsOutside(array $allowed): void
    {
        $offending = DB::table(self::TABLE)->whereNotIn('type', $allowed)->count();

        if ($offending > 0) {
            throw new RuntimeException(sprintf(
                '%d question(s) have a type outside [%s]; fix the data before migrating.',
                $offending,
                implode(', ', $allowed)
            ));
        }
    }

    private function replaceEnum(array $types): void
    {
        // Laravel's enum()->change() is not supported on PostgreSQL, where an
        // enum is a varchar + named CHECK constraint. Swap the constraint directly.
        if (DB::getDriverName() === 'pgsql') {
            $quoted = implode(', ', array_map(fn (string $t) => DB::getPdo()->quote($t), $types));

            DB::statement(sprintf('ALTER TABLE %s DROP CONSTRAINT IF EXISTS %s', self::TABLE, self::CONSTRAINT));
            DB::statement(sprintf(
                'ALTER TABLE %s ADD CONSTRAINT %s CHECK (type IN (%s))',
                self::TABLE,
                self::CONSTRAINT,
                $quoted
            ));

            return;
        }

        Schema::table(self::TABLE, function (Blueprint $table) use ($types) {
            $table->enum('type', $types)->default('mcq')->change();
        });
    }
};
