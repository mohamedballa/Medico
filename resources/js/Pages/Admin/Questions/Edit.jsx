// resources/js/Pages/Admin/Questions/Edit.jsx
import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useRef, useEffect, useState } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Paragraph from '@editorjs/paragraph';
import List from '@editorjs/list';

export default function Edit({ question }) {
    const qRef = useRef(null);
    const eRef = useRef(null);
    const [type, setType] = useState(question.type);
    const [choices, setChoices] = useState(
        question.choices.map(c => ({
            id: c.id,
            label: c.choice_label,
            text: c.choice_text
        }))
    );

    const { data, setData, put, processing, errors } = useForm({
        question_text: question.question_text || { blocks: [] },
        type: question.type,
        correct_answer: question.correct_answer,
        explanation: question.explanation || { blocks: [] },
        order: question.order,
        choices: [],
    });

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
        const nextLabel = String.fromCharCode(65 + choices.length);
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
            choices: type === 'mcq' ? choices.map(c => ({
                id: c.id,
                label: c.label,
                text: c.text
            })) : [],
        };

        put(route('admin.questions.update', question.id), {
            data: finalData,
        });
    };

    return (
        <AppLayout>
            <Head title="Edit Question" />
            <div className=" bg-primary min-h-screen pb-5">
            <div className=" bg-primary h-[200px]"></div>
            <div className="py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h1 className="text-2xl font-bold mb-6">Edit Question</h1>

                        <form onSubmit={submit} className="space-y-6">
                            {/* Same form as Create.jsx — just change `post` → `put` */}
                            {/* Copy everything from Create.jsx and adjust */}
                            {/* ... (same fields, same logic) */}
                            {/* Only difference: pre-filled data */}
                        </form>
                    </div>
                </div>
            </div>
            </div>
        </AppLayout>
    );
}