<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MakeAdminCommandTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_grants_admin_to_an_existing_user(): void
    {
        $user = User::factory()->create();

        $this->artisan('medico:make-admin', ['email' => $user->email])
            ->assertSuccessful();

        $this->assertTrue($user->fresh()->is_admin);
    }

    public function test_it_revokes_admin_with_the_flag(): void
    {
        $user = User::factory()->admin()->create();

        $this->artisan('medico:make-admin', ['email' => $user->email, '--revoke' => true])
            ->assertSuccessful();

        $this->assertFalse($user->fresh()->is_admin);
    }

    public function test_it_fails_for_unknown_or_invalid_emails(): void
    {
        $this->artisan('medico:make-admin', ['email' => 'ghost@example.com'])->assertFailed();
        $this->artisan('medico:make-admin', ['email' => 'not-an-email'])->assertFailed();
    }

    public function test_is_admin_is_not_mass_assignable(): void
    {
        $user = User::create([
            'name' => 'Mallory',
            'email' => 'mallory@example.com',
            'password' => 'secret123',
            'is_admin' => true,
        ]);

        $this->assertFalse((bool) $user->fresh()->is_admin);
    }
}
