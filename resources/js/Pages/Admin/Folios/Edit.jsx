import { useForm } from '@inertiajs/react';
import AdminPage, { moduleTrail } from '@/components/Admin/AdminPage';
import FolioForm, { toFormSlides, toPayloadSlides } from '@/components/Admin/FolioForm';

export default function Edit({ folio }) {
    const form = useForm({
        title: folio.title,
        order: folio.order,
        slides: toFormSlides(folio.slides),
    });

    const submit = (e) => {
        e.preventDefault();
        form.transform((data) => ({ ...data, slides: toPayloadSlides(data.slides) }));
        form.put(route('admin.folios.update', folio.id));
    };

    return (
        <AdminPage
            title="Edit Folio"
            heading={<>Edit <span className="text-indigo-600">{folio.title}</span></>}
            subheading={moduleTrail(folio.module)}
            widthClass="max-w-4xl"
        >
            <FolioForm
                form={form}
                onSubmit={submit}
                submitLabel="Update Folio"
                cancelHref={route('admin.folios.index', { module: folio.module_id })}
            />
        </AdminPage>
    );
}
