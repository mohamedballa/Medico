<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class PublicRoutesTest extends TestCase
{
    use RefreshDatabase;

    /** Every link rendered by Nav.jsx / Footer.jsx must resolve. */
    public static function navigationLinks(): array
    {
        return [
            'home' => ['/', 'Home'],
            'syllabus' => ['/Syllabus', 'Syllabus'],
            'about' => ['/About', 'About'],
            'terms' => ['/Terms', 'Terms&Conditions'],
            'login' => ['/login', 'Login'],
            'signup' => ['/signup', 'Signup'],
        ];
    }

    #[DataProvider('navigationLinks')]
    public function test_navigation_link_renders_expected_page(string $uri, string $component): void
    {
        $this->get($uri)
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component($component));
    }

    public static function removedDuplicateRoutes(): array
    {
        return [
            ['/Login'],
            ['/Signup'],
            ['/Admin'],
            ['/Dashboard'],
            ['/Syllabus2'],
        ];
    }

    #[DataProvider('removedDuplicateRoutes')]
    public function test_removed_inertia_duplicates_no_longer_exist(string $uri): void
    {
        $this->get($uri)->assertNotFound();
    }

    public function test_dashboard_requires_authentication(): void
    {
        $this->get('/dashboard')->assertRedirect(route('login'));
    }

    public function test_http_errors_render_the_inertia_error_page_outside_debug_mode(): void
    {
        config(['app.debug' => false]);

        $this->get('/definitely-missing')
            ->assertNotFound()
            ->assertInertia(fn ($page) => $page->component('Error')->where('status', 404));
    }
}
