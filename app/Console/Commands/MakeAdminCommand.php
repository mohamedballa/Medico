<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Validator;

class MakeAdminCommand extends Command
{
    protected $signature = 'medico:make-admin
                            {email : Email address of an existing user}
                            {--revoke : Remove admin privileges instead of granting them}';

    protected $description = 'Grant (or revoke) admin privileges for an existing user';

    public function handle(): int
    {
        $email = (string) $this->argument('email');

        if (Validator::make(['email' => $email], ['email' => 'required|email'])->fails()) {
            $this->error("\"{$email}\" is not a valid email address.");

            return self::INVALID;
        }

        $user = User::where('email', $email)->first();

        if (! $user) {
            $this->error("No user found with email \"{$email}\".");

            return self::FAILURE;
        }

        $grant = ! $this->option('revoke');

        if ($user->is_admin === $grant) {
            $this->info(sprintf('%s is already %s.', $email, $grant ? 'an admin' : 'a regular user'));

            return self::SUCCESS;
        }

        // forceFill bypasses $fillable on purpose: this is the only sanctioned path.
        $user->forceFill(['is_admin' => $grant])->save();

        $this->info(sprintf('%s admin privileges for %s.', $grant ? 'Granted' : 'Revoked', $email));

        return self::SUCCESS;
    }
}
