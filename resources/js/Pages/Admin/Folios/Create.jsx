import { useForm } from '@inertiajs/react';
import AdminPage, { moduleTrail } from '@/components/Admin/AdminPage';
import FolioForm, { toFormSlides, toPayloadSlides } from '@/components/Admin/FolioForm';

export default function Create({ module }) {
    const form = useForm({
        module_id: module.id,
        title: '',
        order: 1,
        slides: toFormSlides(),
    });

    const submit = (e) => {
        e.preventDefault();
        form.transform((data) => ({ ...data, slides: toPayloadSlides(data.slides) }));
        form.post(route('admin.folios.store'));
    };

    return (
        <AdminPage
            title="Create Folio"
            heading={<>New Folio in <span className="text-indigo-600">{module.name}</span></>}
            subheading={moduleTrail(module)}
            widthClass="max-w-4xl"
        >
            <FolioForm
                form={form}
                onSubmit={submit}
                submitLabel="Create Folio"
                cancelHref={route('admin.folios.index', { module: module.id })}
            />
        </AdminPage>
    );
}
