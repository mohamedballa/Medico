// resources/js/Pages/Admin/Modules/Create.jsx
import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Create({ chapters }) {
    const { data, setData, post, processing, errors } = useForm({
        chapter_id: '',
        name: '',
        description: '',
        order: 1,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.modules.store'));
    };

    return (
        <AppLayout>
            <Head title="Create Module" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto">
                    <form onSubmit={submit} className="bg-white p-6 rounded-lg shadow space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Chapter</label>
                            <select
                                value={data.chapter_id}
                                onChange={e => setData('chapter_id', e.target.value)}
                                className="mt-1 block w-full border rounded-md p-2"
                            >
                                <option value="">Select Chapter</option>
                                {chapters.map(ch => (
                                    <option key={ch.id} value={ch.id}>
                                        [{ch.topic.subject.name} → {ch.topic.name}] {ch.name}
                                    </option>
                                ))}
                            </select>
                            {errors.chapter_id && <p className="text-red-600 text-sm mt-1">{errors.chapter_id}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="mt-1 block w-full border rounded-md p-2"
                            />
                            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                className="mt-1 block w-full border rounded-md p-2"
                                rows={3}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Order</label>
                            <input
                                type="number"
                                value={data.order}
                                onChange={e => setData('order', e.target.value)}
                                className="mt-1 block w-full border rounded-md p-2"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {processing ? 'Saving...' : 'Create Module'}
                            </button>
                            <Link href={route('admin.modules.index')} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}