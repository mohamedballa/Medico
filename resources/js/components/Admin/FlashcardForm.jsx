import { Link } from '@inertiajs/react';

export default function FlashcardForm({ form, onSubmit, submitLabel, cancelHref }) {
    const { data, setData, processing, errors } = form;

    const fieldError = (name) => errors[name] && <p className="text-red-600 text-sm mt-1">{errors[name]}</p>;

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div>
                <label htmlFor="flashcard-front" className="block text-sm font-medium">Front (prompt)</label>
                <textarea
                    id="flashcard-front"
                    rows={3}
                    value={data.front}
                    onChange={(e) => setData('front', e.target.value)}
                    className="mt-1 block w-full border rounded p-2"
                    required
                />
                {fieldError('front')}
            </div>

            <div>
                <label htmlFor="flashcard-back" className="block text-sm font-medium">Back (answer)</label>
                <textarea
                    id="flashcard-back"
                    rows={3}
                    value={data.back}
                    onChange={(e) => setData('back', e.target.value)}
                    className="mt-1 block w-full border rounded p-2"
                    required
                />
                {fieldError('back')}
            </div>

            <div>
                <label htmlFor="flashcard-hint" className="block text-sm font-medium">Hint (optional)</label>
                <input
                    id="flashcard-hint"
                    type="text"
                    value={data.hint ?? ''}
                    onChange={(e) => setData('hint', e.target.value)}
                    className="mt-1 block w-full border rounded p-2"
                />
                {fieldError('hint')}
            </div>

            <div>
                <label htmlFor="flashcard-order" className="block text-sm font-medium">Order</label>
                <input
                    id="flashcard-order"
                    type="number"
                    min={0}
                    value={data.order}
                    onChange={(e) => setData('order', e.target.value)}
                    className="mt-1 block w-full border rounded p-2"
                    required
                />
                {fieldError('order')}
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
