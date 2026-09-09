<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;

class AppServiceProvider extends ServiceProvider
{
    /** Attempts per minute for one email from one IP (blocks credential stuffing on an account). */
    public const AUTH_PER_ACCOUNT_LIMIT = 6;

    /** Attempts per minute for one IP across all emails (looser: students share campus NAT). */
    public const AUTH_PER_IP_LIMIT = 60;

    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureRateLimiting();
    }

    private function configureRateLimiting(): void
    {
        RateLimiter::for('auth', function (Request $request): array {
            $email = Str::lower(trim((string) $request->input('email', '')));

            return [
                Limit::perMinute(self::AUTH_PER_ACCOUNT_LIMIT)->by('auth:account:'.$email.'|'.$request->ip()),
                Limit::perMinute(self::AUTH_PER_IP_LIMIT)->by('auth:ip:'.$request->ip()),
            ];
        });
    }
}
