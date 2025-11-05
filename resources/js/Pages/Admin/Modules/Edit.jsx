// resources/js/Pages/Admin/Modules/Edit.jsx
import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Edit({ module: mod, chapters }) {
    const { data, setData, put, processing, errors } = useForm({
        chapter_id: mod.chapter_id,
        name: mod.name,
        description: mod.description ?? '',
        order: mod.order,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.modules.update', mod.id));
    };

    // Same form as Create.jsx — just change `post` → `put`
    // ... (copy Create.jsx and adjust)
}