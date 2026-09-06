import { Link } from '@inertiajs/react';
import EditorJsField, { EMPTY_DOCUMENT, normalizeDocument } from '@/components/Admin/EditorJsField';

let slideKeySeed = 0;
const nextSlideKey = () => `slide-${Date.now()}-${slideKeySeed++}`;

/** Gives every slide a stable client-side key so Editor.js instances survive re-orders. */
export function toFormSlides(slides = []) {
    const list = slides.map((slide) => ({
        key: nextSlideKey(),
        id: slide.id ?? null,
        content: normalizeDocument(slide.content),
        order: slide.order ?? 1,
    }));
    return list.length > 0 ? list : [{ key: nextSlideKey(), id: null, content: EMPTY_DOCUMENT, order: 1 }];
}

/** Strips client-only fields before the payload is sent to the server. */
export function toPayloadSlides(slides) {
    return slides.map(({ id, content, order }) => (id ? { id, content, order } : { content, order }));
}

export default function FolioForm({ form, onSubmit, submitLabel, cancelHref }) {
    const { data, setData, processing, errors } = form;

    const updateSlide = (key, patch) =>
        setData('slides', data.slides.map((s) => (s.key === key ? { ...s, ...patch } : s)));

    const addSlide = () =>
        setData('slides', [
            ...data.slides,
            { key: nextSlideKey(), id: null, content: EMPTY_DOCUMENT, order: data.slides.length + 1 },
        ]);

    const removeSlide = (key) => setData('slides', data.slides.filter((s) => s.key !== key));

    const fieldError = (name) => errors[name] && <p className="text-red-600 text-sm mt-1">{errors[name]}</p>;

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="sm:col-span-3">
                    <label htmlFor="folio-title" className="block text-sm font-medium">Title</label>
                    <input
                        id="folio-title"
                        type="text"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        className="mt-1 block w-full border rounded p-2"
                        required
                        maxLength={255}
                    />
                    {fieldError('title')}
                </div>
                <div>
                    <label htmlFor="folio-order" className="block text-sm font-medium">Order</label>
                    <input
                        id="folio-order"
                        type="number"
                        min={0}
                        value={data.order}
                        onChange={(e) => setData('order', e.target.value)}
                        className="mt-1 block w-full border rounded p-2"
                        required
                    />
                    {fieldError('order')}
                </div>
            </div>

            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium">Slides ({data.slides.length})</label>
                    <button type="button" onClick={addSlide} className="text-sm text-indigo-600 hover:underline">
                        + Add Slide
                    </button>
                </div>
                {fieldError('slides')}

                <div className="space-y-6">
                    {data.slides.map((slide, index) => (
                        <fieldset key={slide.key} className="border rounded-lg p-4 bg-gray-50">
                            <div className="flex justify-between items-center mb-3 gap-4">
                                <span className="font-medium">Slide {index + 1}</span>
                                <div className="flex items-center gap-3">
                                    <label className="text-sm">
                                        Order{' '}
                                        <input
                                            type="number"
                                            min={0}
                                            value={slide.order}
                                            onChange={(e) => updateSlide(slide.key, { order: e.target.value })}
                                            className="w-20 border rounded p-1 ml-1"
                                            required
                                        />
                                    </label>
                                    {data.slides.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeSlide(slide.key)}
                                            className="text-sm text-red-600 hover:text-red-800"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            </div>
                            <EditorJsField
                                rich
                                value={slide.content}
                                onChange={(content) => updateSlide(slide.key, { content })}
                                minHeightClass="min-h-48"
                            />
                            {fieldError(`slides.${index}.content`)}
                            {fieldError(`slides.${index}.order`)}
                        </fieldset>
                    ))}
                </div>
            </div>

            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={processing}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                >
                    {processing ? 'Saving...' : submitLabel}
                </button>
                <Link href={cancelHref} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                    Cancel
                </Link>
            </div>
        </form>
    );
}
