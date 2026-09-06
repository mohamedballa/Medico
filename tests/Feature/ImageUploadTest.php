<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\Concerns\CreatesCurriculum;
use Tests\TestCase;

class ImageUploadTest extends TestCase
{
    use CreatesCurriculum;
    use RefreshDatabase;

    public function test_admin_can_upload_a_valid_image(): void
    {
        Storage::fake('public');

        $response = $this->actingAs($this->createAdmin())
            ->postJson(route('admin.upload-image'), ['image' => UploadedFile::fake()->image('slide.png', 10, 10)])
            ->assertOk()
            ->assertJsonStructure(['url']);

        $files = Storage::disk('public')->files('editor');
        $this->assertCount(1, $files);
        $this->assertStringEndsWith(basename($files[0]), $response->json('url'));
    }

    public function test_non_image_files_and_oversized_images_are_rejected(): void
    {
        Storage::fake('public');
        $admin = $this->createAdmin();

        $this->actingAs($admin)
            ->postJson(route('admin.upload-image'), ['image' => UploadedFile::fake()->create('payload.php', 10, 'application/x-php')])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('image');

        $this->actingAs($admin)
            ->postJson(route('admin.upload-image'), ['image' => UploadedFile::fake()->create('huge.gif', 4096, 'image/gif')])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('image');

        $this->actingAs($admin)
            ->postJson(route('admin.upload-image'), ['image' => UploadedFile::fake()->image('big.png')->size(3000)])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('image');

        $this->assertEmpty(Storage::disk('public')->allFiles());
    }

    public function test_non_admins_cannot_upload(): void
    {
        $this->actingAs(User::factory()->create())
            ->postJson(route('admin.upload-image'), ['image' => UploadedFile::fake()->image('slide.png')])
            ->assertForbidden();
    }
}
