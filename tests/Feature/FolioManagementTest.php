<?php

namespace Tests\Feature;

use App\Models\Folio;
use App\Models\FolioSlide;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Concerns\CreatesCurriculum;
use Tests\TestCase;

class FolioManagementTest extends TestCase
{
    use CreatesCurriculum;
    use RefreshDatabase;

    public function test_admin_can_store_a_folio_with_slides(): void
    {
        $module = $this->createModule();

        $this->actingAs($this->createAdmin())
            ->post(route('admin.folios.store'), [
                'module_id' => $module->id,
                'title' => 'Intro to Bones',
                'order' => 1,
                'slides' => [
                    ['content' => $this->editorDocument('Slide 1'), 'order' => 1],
                    ['content' => $this->editorDocument('Slide 2'), 'order' => 2],
                ],
            ])
            ->assertRedirect(route('admin.folios.index', ['module' => $module->id]));

        $this->assertDatabaseCount('folios', 1);
        $this->assertDatabaseCount('folio_slides', 2);
    }

    public function test_invalid_slide_aborts_the_whole_folio_write(): void
    {
        $module = $this->createModule();

        $this->actingAs($this->createAdmin())
            ->post(route('admin.folios.store'), [
                'module_id' => $module->id,
                'title' => 'Broken',
                'order' => 1,
                'slides' => [
                    ['content' => $this->editorDocument(), 'order' => 1],
                    ['content' => 'not-a-document', 'order' => 2],
                ],
            ])
            ->assertSessionHasErrors('slides.1.content');

        $this->assertDatabaseCount('folios', 0);
        $this->assertDatabaseCount('folio_slides', 0);
    }

    public function test_update_rejects_slide_ids_that_belong_to_another_folio(): void
    {
        $module = $this->createModule();
        $target = Folio::create(['module_id' => $module->id, 'title' => 'Target', 'order' => 1]);
        $other = Folio::create(['module_id' => $module->id, 'title' => 'Other', 'order' => 2]);
        $foreignSlide = FolioSlide::create(['folio_id' => $other->id, 'content' => $this->editorDocument('keep'), 'order' => 1]);

        $this->actingAs($this->createAdmin())
            ->put(route('admin.folios.update', $target), [
                'title' => 'Target',
                'order' => 1,
                'slides' => [
                    ['id' => $foreignSlide->id, 'content' => $this->editorDocument('hijacked'), 'order' => 1],
                ],
            ])
            ->assertSessionHasErrors('slides.0.id');

        $this->assertSame('keep', $foreignSlide->fresh()->content['blocks'][0]['data']['text']);
    }

    public function test_update_syncs_slides(): void
    {
        $module = $this->createModule();
        $folio = Folio::create(['module_id' => $module->id, 'title' => 'Folio', 'order' => 1]);
        $keep = FolioSlide::create(['folio_id' => $folio->id, 'content' => $this->editorDocument('a'), 'order' => 1]);
        $drop = FolioSlide::create(['folio_id' => $folio->id, 'content' => $this->editorDocument('b'), 'order' => 2]);

        $this->actingAs($this->createAdmin())
            ->put(route('admin.folios.update', $folio), [
                'title' => 'Folio v2',
                'order' => 3,
                'slides' => [
                    ['id' => $keep->id, 'content' => $this->editorDocument('a2'), 'order' => 1],
                    ['content' => $this->editorDocument('c'), 'order' => 2],
                ],
            ])
            ->assertSessionHasNoErrors();

        $this->assertSame('Folio v2', $folio->fresh()->title);
        $this->assertSame('a2', $keep->fresh()->content['blocks'][0]['data']['text']);
        $this->assertNull($drop->fresh());
        $this->assertSame(2, $folio->slides()->count());
    }
}
