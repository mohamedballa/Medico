<?php

namespace Tests\Feature;

use App\Models\User;
use App\Notifications\VerifyEmailNotification;
use App\Providers\AppServiceProvider;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\URL;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_unknown_email_and_wrong_password_return_the_same_generic_error(): void
    {
        User::factory()->create(['email' => 'known@example.com']);

        $unknown = $this->from('/login')->post('/login', ['email' => 'nobody@example.com', 'password' => 'whatever']);
        $wrong = $this->from('/login')->post('/login', ['email' => 'known@example.com', 'password' => 'wrong-password']);

        $unknown->assertRedirect('/login')->assertSessionHasErrors(['email' => __('auth.failed')]);
        $wrong->assertRedirect('/login')
            ->assertSessionHasErrors(['email' => __('auth.failed')])
            ->assertSessionDoesntHaveErrors('password');

        $this->assertGuest();
    }

    public function test_valid_credentials_log_the_user_in(): void
    {
        $user = User::factory()->create();

        $this->post('/login', ['email' => $user->email, 'password' => 'password'])
            ->assertRedirect(route('dashboard'));

        $this->assertAuthenticatedAs($user);
    }

    public function test_unverified_users_are_sent_to_the_verification_notice(): void
    {
        $user = User::factory()->unverified()->create();

        $this->post('/login', ['email' => $user->email, 'password' => 'password'])
            ->assertRedirect(route('verification.notice', ['email' => $user->email]));

        $this->assertGuest();
    }

    public function test_login_is_rate_limited_per_email_and_ip(): void
    {
        foreach (range(1, AppServiceProvider::AUTH_PER_ACCOUNT_LIMIT) as $_) {
            $this->post('/login', ['email' => 'Target@Example.com', 'password' => 'x'])->assertStatus(302);
        }

        // Same account, case-insensitive email: blocked.
        $this->post('/login', ['email' => 'target@example.com', 'password' => 'x'])->assertStatus(429);

        // Another student behind the same NAT (same IP, different email): NOT blocked.
        $this->post('/login', ['email' => 'classmate@example.com', 'password' => 'x'])->assertStatus(302);
    }

    public function test_login_has_a_looser_per_ip_ceiling(): void
    {
        foreach (range(1, AppServiceProvider::AUTH_PER_IP_LIMIT) as $i) {
            $this->post('/login', ['email' => "student{$i}@example.com", 'password' => 'x'])->assertStatus(302);
        }

        $this->post('/login', ['email' => 'one-more@example.com', 'password' => 'x'])->assertStatus(429);
    }

    public function test_signup_and_forgot_password_share_the_auth_limiter(): void
    {
        Notification::fake();

        foreach (range(1, AppServiceProvider::AUTH_PER_ACCOUNT_LIMIT) as $_) {
            $this->post('/forgot-password', ['email' => 'victim@example.com'])->assertStatus(302);
        }
        $this->post('/forgot-password', ['email' => 'victim@example.com'])->assertStatus(429);

        $signup = ['name' => 'A', 'password' => 'secret123', 'password_confirmation' => 'secret123'];
        foreach (range(1, AppServiceProvider::AUTH_PER_ACCOUNT_LIMIT) as $_) {
            $this->post('/signup', [...$signup, 'email' => 'spam@example.com'])->assertStatus(302);
        }
        $this->post('/signup', [...$signup, 'email' => 'spam@example.com'])->assertStatus(429);
    }

    public function test_signup_cannot_mass_assign_admin(): void
    {
        Notification::fake();

        $this->post('/signup', [
            'name' => 'Mallory',
            'email' => 'mallory@example.com',
            'password' => 'secret123',
            'password_confirmation' => 'secret123',
            'is_admin' => true,
        ])->assertRedirect(route('verification.notice', ['email' => 'mallory@example.com']));

        $user = User::where('email', 'mallory@example.com')->firstOrFail();

        $this->assertFalse((bool) $user->is_admin);
        $this->assertNull($user->email_verified_at);
        Notification::assertSentTo($user, VerifyEmailNotification::class);
    }

    public function test_verification_link_without_a_valid_signature_is_rejected(): void
    {
        $user = User::factory()->unverified()->create();

        $this->get(route('verification.verify', ['id' => $user->id, 'hash' => sha1($user->email)]))
            ->assertForbidden();

        $this->assertNull($user->fresh()->email_verified_at);
    }

    public function test_signed_verification_link_verifies_the_email(): void
    {
        $user = User::factory()->unverified()->create();

        $url = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            ['id' => $user->id, 'hash' => sha1($user->email)]
        );

        $this->get($url)->assertRedirect(route('login'));

        $this->assertNotNull($user->fresh()->email_verified_at);
    }

    public function test_expired_verification_link_is_rejected(): void
    {
        $user = User::factory()->unverified()->create();

        $url = URL::temporarySignedRoute(
            'verification.verify',
            now()->subMinute(),
            ['id' => $user->id, 'hash' => sha1($user->email)]
        );

        $this->get($url)->assertForbidden();
        $this->assertNull($user->fresh()->email_verified_at);
    }

    public function test_resend_endpoint_does_not_reveal_whether_an_account_exists(): void
    {
        Notification::fake();
        $user = User::factory()->unverified()->create();

        $existing = $this->from('/email/verify')->post(route('verification.resend'), ['email' => $user->email]);
        $missing = $this->from('/email/verify')->post(route('verification.resend'), ['email' => 'ghost@example.com']);

        $this->assertSame(
            $existing->baseResponse->getSession()->get('status'),
            $missing->baseResponse->getSession()->get('status')
        );
        Notification::assertSentTo($user, VerifyEmailNotification::class);
    }
}
