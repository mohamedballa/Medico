// resources/js/Pages/Admin/FolioSlides/Edit.jsx
import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useRef, useEffect } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Image from '@editorjs/image';
import Table from '@editorjs/table';

export default function Edit({ slide }) {
    const editorRef = useRef(null);
    const { data, setData, put, processing } = useForm({
        content: slide.content,
        order: slide.order,
    });

    useEffect(() => {
        const editor = new EditorJS({
            holder: editorRef.current,
            tools: { header: Header, list: List, image: Image, table: Table },
            data: data.content,
            onChange: async (api) => {
                const savedData = await api.saver.save();
                setData('content', savedData);
            }
        });

        return () => editor.isReady.then(() => editor.destroy());
    }, []);

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.folio-slides.update', slide.id));
    };

    return (
        <AppLayout>
            <Head title="Edit Slide" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h1 className="text-2xl font-bold mb-4">Edit Slide</h1>

                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium">Order</label>
                                <input
                                    type="number"
                                    value={data.order}
                                    onChange={e => setData('order', e.target.value)}
                                    className="mt-1 block w-full border rounded p-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Content</label>
                                <div ref={editorRef} className="border rounded p-4 min-h-96 bg-gray-50" />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    {processing ? 'Saving...' : 'Update Slide'}
                                </button>
                                <Link href={route('admin.folios.edit', slide.folio_id)} className="px-4 py-2 bg-gray-300 rounded">
                                    Cancel
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}