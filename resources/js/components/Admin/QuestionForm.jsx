import { Link } from '@inertiajs/react';
import EditorJsField, { EMPTY_DOCUMENT, normalizeDocument } from '@/components/Admin/EditorJsField';

export const QUESTION_TYPES = {
    MCQ: 'mcq',
    TRUE_FALSE: 'true_false',
};

let choiceKeySeed = 0;
const nextChoiceKey = () => `choice-${Date.now()}-${choiceKeySeed++}`;
const labelForIndex = (index) => String.fromCharCode(65 + index); // A, B, C...

export function toFormChoices(choices = []) {
    const list = choices.map((c, index) => ({
        key: nextChoiceKey(),
        id: c.id ?? null,
        label: c.choice_label ?? c.label ?? labelForIndex(index),
        text: c.choice_text ?? c.text ?? '',
    }));
    return list.length >= 2
        ? list
        : [0, 1].map((i) => list[i] ?? { key: nextChoiceKey(), id: null, label: labelForIndex(i), text: '' });
}

/** Builds the exact payload the QuestionController expects. */
export function toQuestionPayload(data) {
    const isMcq = data.type === QUESTION_TYPES.MCQ;
    return {
        ...data,
        question_text: normalizeDocument(data.question_text),
        explanation: normalizeDocument(data.explanation),
        choices: isMcq
            ? data.choices.map(({ id, label, text }) => (id ? { id, label, text } : { label, text }))
            : [],
    };
}

export default function QuestionForm({ form, onSubmit, submitLabel, cancelHref }) {
    const { data, setData, processing, errors } = form;
    const isMcq = data.type === QUESTION_TYPES.MCQ;

    const fieldError = (name) => errors[name] && <p className="text-red-600 text-sm mt-1">{errors[name]}</p>;

    const relabel = (choices) => choices.map((c, i) => ({ ...c, label: labelForIndex(i) }));

    const addChoice = () =>
        setData('choices', relabel([...data.choices, { key: nextChoiceKey(), id: null, label: '', text: '' }]));

    const removeChoice = (key) => {
        const remaining = relabel(data.choices.filter((c) => c.key !== key));
        const stillValid = remaining.some((c) => c.label === data.correct_answer);
        setData((prev) => ({ ...prev, choices: remaining, correct_answer: stillValid ? prev.correct_answer : '' }));
    };

    const updateChoiceText = (key, text) =>
        setData('choices', data.choices.map((c) => (c.key === key ? { ...c, text } : c)));

    const changeType = (type) => setData((prev) => ({ ...prev, type, correct_answer: '' }));

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium mb-2">Question</label>
                <EditorJsField value={data.question_text} onChange={(doc) => setData('question_text', doc)} />
                {fieldError('question_text')}
                {fieldError('question_text.blocks')}
            </div>

            <div>
                <label htmlFor="question-type" className="block text-sm font-medium">Question Type</label>
                <select
                    id="question-type"
                    value={data.type}
                    onChange={(e) => changeType(e.target.value)}
                    className="mt-1 block w-full border rounded p-2"
                >
                    <option value={QUESTION_TYPES.MCQ}>Multiple Choice (MCQ)</option>
                    <option value={QUESTION_TYPES.TRUE_FALSE}>True / False</option>
                </select>
                {fieldError('type')}
            </div>

            {isMcq && (
                <div>
                    <label className="block text-sm font-medium mb-2">Choices</label>
                    <div className="space-y-3">
                        {data.choices.map((choice) => (
                            <div key={choice.key} className="flex gap-2 items-center">
                                <span className="w-12 text-center border rounded p-2 bg-gray-100">{choice.label}</span>
                                <input
                                    type="text"
                                    placeholder="Enter choice text"
                                    value={choice.text}
                                    onChange={(e) => updateChoiceText(choice.key, e.target.value)}
                                    className="flex-1 border rounded p-2"
                                    maxLength={1000}
                                    required
                                />
                                {data.choices.length > 2 && (
                                    <button
                                        type="button"
                                        onClick={() => removeChoice(choice.key)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                        <button type="button" onClick={addChoice} className="text-sm text-green-600 hover:underline">
                            + Add Choice
                        </button>
                    </div>
                    {fieldError('choices')}
                </div>
            )}

            <div>
                <label htmlFor="correct-answer" className="block text-sm font-medium">Correct Answer</label>
                <select
                    id="correct-answer"
                    value={data.correct_answer}
                    onChange={(e) => setData('correct_answer', e.target.value)}
                    className="mt-1 block w-full border rounded p-2"
                    required
                >
                    <option value="">Select</option>
                    {isMcq
                        ? data.choices.map((c) => (
                              <option key={c.key} value={c.label}>
                                  {c.label} - {c.text || 'Empty'}
                              </option>
                          ))
                        : (
                            <>
                                <option value="true">True</option>
                                <option value="false">False</option>
                            </>
                        )}
                </select>
                {fieldError('correct_answer')}
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Explanation (Optional)</label>
                <EditorJsField
                    value={data.explanation}
                    onChange={(doc) => setData('explanation', doc)}
                    minHeightClass="min-h-48"
                />
                {fieldError('explanation')}
            </div>

            <div>
                <label htmlFor="question-order" className="block text-sm font-medium">Order</label>
                <input
                    id="question-order"
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
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
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

export { EMPTY_DOCUMENT };
