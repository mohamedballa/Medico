import { useForm } from '@inertiajs/react';
import AdminPage, { moduleTrail } from '@/components/Admin/AdminPage';
import FlashcardForm from '@/components/Admin/FlashcardForm';

export default function Edit({ flashcard }) {
    const form = useForm({
        front: flashcard.front,
        back: flashcard.back,
        hint: flashcard.hint ?? '',
        order: flashcard.order,
    });

    const submit = (e) => {
        e.preventDefault();
        form.put(route('admin.flashcards.update', flashcard.id));
    };

    return (
        <AdminPage
            title="Edit Flashcard"
            heading="Edit Flashcard"
            subheading={moduleTrail(flashcard.module)}
            widthClass="max-w-3xl"
        >
            <FlashcardForm
                form={form}
                onSubmit={submit}
                submitLabel="Update Flashcard"
                cancelHref={route('admin.flashcards.index', { module: flashcard.module_id })}
            />
        </AdminPage>
    );
}
