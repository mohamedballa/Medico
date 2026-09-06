import { Link, useForm } from '@inertiajs/react';
import AdminPage from '@/components/Admin/AdminPage';
import EditorJsField, { normalizeDocument } from '@/components/Admin/EditorJsField';

export default function Edit({ slide }) {
    const { data, setData, put, processing, errors } = useForm({
        content: normalizeDocument(slide.content),
        order: slide.order,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.folio-slides.update', slide.id));
    };

    return (
        <AdminPage title="Edit Slide" heading="Edit Slide" widthClass="max-w-4xl">
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
                        {processing ? 'Saving...' : 'Update Slide'}
                    </button>
                    <Link href={route('admin.folios.edit', slide.folio_id)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                        Cancel
                    </Link>
                </div>
            </form>
        </AdminPage>
    );
}
