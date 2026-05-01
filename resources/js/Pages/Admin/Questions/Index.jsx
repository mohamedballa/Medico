// resources/js/Pages/Admin/Questions/Index.jsx
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Index({ module }) {
    const { flash } = usePage().props;

    return (
        <AppLayout>
            <Head title={`Questions - ${module.name}`} />
            <div className=" bg-primary min-h-screen pb-5">
            <div className=" bg-primary h-[200px]"></div>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {flash?.success && (
                        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
                            {flash.success}
                        </div>
                    )}

                    <div className="bg-white shadow rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Questions in <span className="text-green-600">{module.name}</span>
                                </h1>
                                <p className="text-sm text-gray-600">
                                    {module.chapter.topic.subject.name} → {module.chapter.topic.name} → {module.chapter.name}
                                </p>
                            </div>
                            <Link
                                href={route('admin.questions.create') + `?module=${module.id}`}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                + Add Question
                            </Link>
                        </div>

                        {module.questions.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <p className="text-lg mb-4">No questions yet.</p>
                                <Link
                                    href={route('admin.questions.create') + `?module=${module.id}`}
                                    className="text-green-600 hover:underline"
                                >
                                    Create your first question
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {module.questions.map(q => (
                                    <div key={q.id} className="border rounded-lg p-4 bg-gray-50">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-800">
                                                    {q.question_text?.blocks?.[0]?.data?.text || 'No text'}
                                                </p>
                                                <div className="flex gap-3 text-xs text-gray-600 mt-1">
                                                    <span>Type: <strong>{q.type.toUpperCase()}</strong></span>
                                                    <span>Answer: <strong>{q.correct_answer}</strong></span>
                                                    <span>Order: {q.order}</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Link
                                                    href={route('admin.questions.edit', q.id)}
                                                    className="text-green-600 hover:text-green-800 text-sm font-medium"
                                                >
                                                    Edit
                                                </Link>
                                                <Link
                                                    href={route('admin.questions.destroy', q.id)}
                                                    method="delete"
                                                    as="button"
                                                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                                                >
                                                    Delete
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            </div>
        </AppLayout>
    );
}