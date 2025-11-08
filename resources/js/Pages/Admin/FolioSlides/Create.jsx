// resources/js/Pages/Admin/FolioSlides/Create.jsx
import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useRef, useEffect } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Image from '@editorjs/image';
import Table from '@editorjs/table';

export default function Create({ folio }) {
    const editorRef = useRef(null);
    const { data, setData, post, processing } = useForm({
        folio_id: folio.id,
        content: { blocks: [] },
        order: folio.slides?.length + 1 || 1,
    });

    useEffect(() => {
        const editor = new EditorJS({
            holder: editorRef.current,
            tools: {
                header: Header,
                list: List,
                image: {
                    class: Image,
                    config: {
                        uploader: {
                            uploadByFile(file) {
                                return new Promise((resolve) => {
                                    const formData = new FormData();
                                    formData.append('image', file);

                                    fetch('/admin/upload-image', {
                                        method: 'POST',
                                        body: formData,
                                        headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content }
                                    })
                                    .then(res => res.json())
                                    .then(data => {
                                        resolve({
                                            success: 1,
                                            file: { url: data.url }
                                        });
                                    });
                                });
                            }
                        }
                    }
                },
                table: Table,
            },
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
        post(route('admin.folio-slides.store'));
    };

    return (
        <AppLayout>
            <Head title="Create Slide" />
            <div className=" bg-primary min-h-screen pb-5">
            <div className=" bg-primary h-[200px]"></div>
            <div className="py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h1 className="text-2xl font-bold mb-4">
                            New Slide in <span className="text-indigo-600">{folio.title}</span>
                        </h1>

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
                                    {processing ? 'Saving...' : 'Create Slide'}
                                </button>
                                <Link href={route('admin.folios.edit', folio.id)} className="px-4 py-2 bg-gray-300 rounded">
                                    Cancel
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            </div>
        </AppLayout>
    );
}