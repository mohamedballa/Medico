import { Link, useForm } from '@inertiajs/react';
import AdminPage from '@/components/Admin/AdminPage';
import EditorJsField, { EMPTY_DOCUMENT } from '@/components/Admin/EditorJsField';

export default function Create({ folio }) {
    const { data, setData, post, processing, errors } = useForm({
        folio_id: folio.id,
        content: EMPTY_DOCUMENT,
        order: (folio.slides?.length ?? 0) + 1,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.folio-slides.store'));
    };

    return (
        <AdminPage
            title="Create Slide"
            heading={<>New Slide in <span className="text-indigo-600">{folio.title}</span></>}
            widthClass="max-w-4xl"
        >
            <form onSubmit={submit} className="space-y-6">
                <div>
                    <label htmlFor="slide-order" className="block text-sm font-medium">Order</label>
                    <input
                        id="slide-order"
                        type="number"
                        min={0}
                        value={data.order}
                        onChange={(e) => setData('order', e.target.value)}
                        className="mt-1 block w-full border rounded p-2"
                        required
                    />
                    {errors.order && <p className="text-red-600 text-sm mt-1">{errors.order}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Content</label>
                    <EditorJsField rich value={data.content} onChange={(doc) => setData('content', doc)} minHeightClass="min-h-96" />
                    {errors.content && <p className="text-red-600 text-sm mt-1">{errors.content}</p>}
                </div>

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {processing ? 'Saving...' : 'Create Slide'}
                    </button>
                    <Link href={route('admin.folios.edit', folio.id)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                        Cancel
                    </Link>
                </div>
            </form>
        </AdminPage>
    );
}
