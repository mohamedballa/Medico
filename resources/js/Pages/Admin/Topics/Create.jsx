import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Create({ subjects }) {
    const { data, setData, post, processing, errors } = useForm({
        subject_id: '',
        name: '',
        description: '',
        order: 1,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.topics.store'));
    };

    return (
        <AppLayout>
            <Head title="Create Topic" />
            <div className=" bg-primary min-h-screen pb-5">
            <div className=" bg-primary h-[200px]"></div>
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900">Create Topic</h1>
                </div>
            </header>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="bg-white p-6 rounded-lg shadow">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Subject</label>
                            <select
                                value={data.subject_id}
                                onChange={e => setData('subject_id', e.target.value)}
                                className="mt-1 block w-full border rounded-md p-2"
                            >
                                <option value="">Select Subject</option>
                                {subjects.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                            {errors.subject_id && <p className="text-red-600 text-sm">{errors.subject_id}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="mt-1 block w-full border rounded-md p-2"
                            />
                            {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                rows="3"
                                className="mt-1 block w-full border rounded-md p-2"
                            ></textarea>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Order</label>
                            <input
                                type="number"
                                value={data.order}
                                onChange={e => setData('order', e.target.value)}
                                className="mt-1 block w-full border rounded-md p-2"
                            />
                        </div>

                        <div className="flex gap-2">
                            <button type="submit" disabled={processing} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                                {processing ? 'Saving...' : 'Create'}
                            </button>
                            <Link href={route('admin.topics.index')} className="px-4 py-2 bg-gray-300 rounded">Cancel</Link>
                        </div>
                    </form>
                </div>
            </div>
            </div>
        </AppLayout>
    );
}