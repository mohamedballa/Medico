// resources/js/Pages/Admin/Modules/Index.jsx
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Index({ subjects }) {
    const { flash } = usePage().props;

    return (
        <AppLayout>
            <Head title="Modules" />
            <div className=" bg-primary min-h-screen pb-5">
            <div className=" bg-primary h-[200px]"></div>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {flash?.success && (
                        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
                            {flash.success}
                        </div>
                    )}

                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Modules</h1>
                        <Link href={route('admin.modules.create')} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                            Add Module
                        </Link>
                    </div>

                    <div className="space-y-8">
                        {subjects.map(subject => (
                            <div key={subject.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                                <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-indigo-100 border-b">
                                    <h3 className="text-xl font-bold text-indigo-900">{subject.name}</h3>
                                </div>

                                {subject.topics.map(topic => (
                                    <div key={topic.id} className="border-b last:border-b-0">
                                        <div className="px-6 py-3 bg-gray-50 font-semibold text-gray-800">
                                            {topic.name}
                                        </div>

                                        {topic.chapters.map(chapter => (
                                            <div key={chapter.id} className="p-4">
                                                <div className="font-medium text-gray-700 mb-3">{chapter.name}</div>

                                                {chapter.modules.length === 0 ? (
                                                    <p className="text-sm text-gray-500 italic">No modules yet.</p>
                                                ) : (
                                                    <div className="space-y-4">
                                                        {chapter.modules.map(module => (
                                                            <div key={module.id} className="border rounded-lg p-4 bg-gray-50">
                                                                <div className="flex justify-between items-start mb-2">
                                                                    <div>
                                                                        <h4 className="font-semibold text-lg">{module.name}</h4>
                                                                        <p className="text-sm text-gray-600">Order: {module.order}</p>
                                                                    </div>
                                                                    <div className="flex gap-2">
                                                                        <Link href={route('admin.modules.edit', module.id)} className="text-indigo-600 hover:text-indigo-900 text-sm">Edit</Link>
                                                                        <Link href={route('admin.modules.destroy', module.id)} method="delete" as="button" className="text-red-600 hover:text-red-900 text-sm">Delete</Link>
                                                                    </div>
                                                                </div>

                                                                {/* Section Counts */}
                                                                <div className="grid grid-cols-3 gap-3 text-sm mt-3">
                                                                    <div className="bg-blue-50 p-2 rounded text-center">
                                                                        <strong className="block text-blue-700">{module.folios_count}</strong>
                                                                        <span className="text-xs">Folios</span>
                                                                    </div>
                                                                    <div className="bg-green-50 p-2 rounded text-center">
                                                                        <strong className="block text-green-700">{module.questions_count}</strong>
                                                                        <span className="text-xs">Questions</span>
                                                                    </div>
                                                                    <div className="bg-purple-50 p-2 rounded text-center">
                                                                        <strong className="block text-purple-700">{module.flashcards_count}</strong>
                                                                        <span className="text-xs">Flashcards</span>
                                                                    </div>
                                                                </div>

                                                                {/* Quick Links */}
                                                                <div className="flex justify-between gap-9 px-20 mt-3 text-xs">
                                                                    <Link href={route('admin.folios.index', { module: module.id })} className="text-blue-600 hover:underline">
                                                                        Manage Folios
                                                                    </Link>
                                                                    <Link href={route('admin.questions.index', { module: module.id })} className="text-green-600 hover:underline">
                                                                        Manage Questions
                                                                    </Link>
                                                                    <Link href={route('admin.flashcards.index', { module: module.id })} className="text-purple-600 hover:underline">
                                                                        Manage Flashcards
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            </div>
        </AppLayout>
    );
}