import { useForm } from '@inertiajs/react';
import AdminPage, { moduleTrail } from '@/components/Admin/AdminPage';
import FlashcardForm from '@/components/Admin/FlashcardForm';

export default function Create({ module }) {
    const form = useForm({
        module_id: module.id,
        front: '',
        back: '',
        hint: '',
        order: 1,
    });

    const submit = (e) => {
        e.preventDefault();
        form.post(route('admin.flashcards.store'));
    };

    return (
        <AdminPage
            title="Create Flashcard"
            heading={<>New Flashcard in <span className="text-indigo-600">{module.name}</span></>}
            subheading={moduleTrail(module)}
            widthClass="max-w-3xl"
        >
            <FlashcardForm
                form={form}
                onSubmit={submit}
                submitLabel="Create Flashcard"
                cancelHref={route('admin.flashcards.index', { module: module.id })}
            />
        </AdminPage>
    );
}
