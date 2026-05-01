// resources/js/Pages/Admin/Questions/Create.jsx
import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useRef, useEffect, useState } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Paragraph from '@editorjs/paragraph';
import List from '@editorjs/list';

export default function Create({ module }) {
    const qRef = useRef(null);
    const eRef = useRef(null);
    const [type, setType] = useState('mcq');
    const [choices, setChoices] = useState([
        { id: 1, label: 'A', text: '' },
        { id: 2, label: 'B', text: '' },
    ]);

    const { data, setData, post, processing, errors } = useForm({
        module_id: module.id,
        question_text: { blocks: [] },
        type: 'mcq',
        correct_answer: '',
        explanation: { blocks: [] },
        order: 1,
        choices: [],
    });

    // Initialize Editor.js
    useEffect(() => {
        const qEditor = new EditorJS({
            holder: qRef.current,
            tools: { header: Header, paragraph: Paragraph, list: List },
            data: data.question_text,
            onChange: async (api) => {
                const saved = await api.saver.save();
                setData('question_text', saved);
            },
        });

        const eEditor = new EditorJS({
            holder: eRef.current,
            tools: { header: Header, paragraph: Paragraph, list: List },
            data: data.explanation,
            onChange: async (api) => {
                const saved = await api.saver.save();
                setData('explanation', saved);
            },
        });

        return () => {
            qEditor.isReady.then(() => qEditor.destroy());
            eEditor.isReady.then(() => eEditor.destroy());
        };
    }, []);

    const addChoice = () => {
        const nextLabel = String.fromCharCode(65 + choices.length); // C, D, E...
        setChoices([...choices, { id: Date.now(), label: nextLabel, text: '' }]);
    };

    const removeChoice = (id) => {
        setChoices(choices.filter(c => c.id !== id));
    };

    const updateChoice = (id, field, value) => {
        setChoices(choices.map(c => c.id === id ? { ...c, [field]: value } : c));
    };

    const submit = (e) => {
        e.preventDefault();

        const finalData = {
            ...data,
            type,
            correct_answer: type === 'true_false'
                ? data.correct_answer
                : choices.find(c => c.label === data.correct_answer)?.label || '',
            choices: type === 'mcq' ? choices.map(c => ({ label: c.label, text: c.text })) : [],
        };

        post(route('admin.questions.store'), {
            data: finalData,
            onSuccess: () => {
                // Optional: reset form
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Create Question" />
            <div className=" bg-primary min-h-screen pb-5">
            <div className=" bg-primary h-[200px]"></div>
            <div className="py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h1 className="text-2xl font-bold mb-6">
                            New Question in <span className="text-green-600">{module.name}</span>
                        </h1>

                        <form onSubmit={submit} className="space-y-6">
                            {/* Question Text */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Question</label>
                                <div ref={qRef} className="border rounded p-4 min-h-64 bg-gray-50" />
                                {errors.question_text && <p className="text-red-600 text-sm mt-1">{errors.question_text}</p>}
                            </div>

                            {/* Type */}
                            <div>
                                <label className="block text-sm font-medium">Question Type</label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="mt-1 block w-full border rounded p-2"
                                >
                                    <option value="mcq">Multiple Choice (MCQ)</option>
                                    <option value="true_false">True / False</option>
                                </select>
                            </div>

                            {/* MCQ Choices */}
                            {type === 'mcq' && (
                                <div>
                                    <label className="block text-sm font-medium mb-2">Choices</label>
                                    <div className="space-y-3">
                                        {choices.map((choice) => (
                                            <div key={choice.id} className="flex gap-2 items-center">
                                                <input
                                                    type="text"
                                                    value={choice.label}
                                                    readOnly
                                                    className="w-12 text-center border rounded p-2 bg-gray-100"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Enter choice text"
                                                    value={choice.text}
                                                    onChange={(e) => updateChoice(choice.id, 'text', e.target.value)}
                                                    className="flex-1 border rounded p-2"
                                                />
                                                {choices.length > 2 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeChoice(choice.id)}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={addChoice}
                                            className="text-sm text-green-600 hover:underline"
                                        >
                                            + Add Choice
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Correct Answer */}
                            <div>
                                <label className="block text-sm font-medium">Correct Answer</label>
                                {type === 'mcq' ? (
                                    <select
                                        value={data.correct_answer}
                                        onChange={(e) => setData('correct_answer', e.target.value)}
                                        className="mt-1 block w-full border rounded p-2"
                                    >
                                        <option value="">Select correct choice</option>
                                        {choices.map(c => (
                                            <option key={c.id} value={c.label}>
                                                {c.label} - {c.text || 'Empty'}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <select
                                        value={data.correct_answer}
                                        onChange={(e) => setData('correct_answer', e.target.value)}
                                        className="mt-1 block w-full border rounded p-2"
                                    >
                                        <option value="">Select</option>
                                        <option value="true">True</option>
                                        <option value="false">False</option>
                                    </select>
                                )}
                                {errors.correct_answer && <p className="text-red-600 text-sm mt-1">{errors.correct_answer}</p>}
                            </div>

                            {/* Explanation */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Explanation (Optional)</label>
                                <div ref={eRef} className="border rounded p-4 min-h-48 bg-gray-50" />
                            </div>

                            {/* Order */}
                            <div>
                                <label className="block text-sm font-medium">Order</label>
                                <input
                                    type="number"
                                    value={data.order}
                                    onChange={(e) => setData('order', e.target.value)}
                                    className="mt-1 block w-full border rounded p-2"
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                                >
                                    {processing ? 'Saving...' : 'Create Question'}
                                </button>
                                <Link
                                    href={route('admin.questions.index') + `?module=${module.id}`}
                                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                >
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