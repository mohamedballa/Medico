import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Index({ subjects }) {
    const { flash } = usePage().props;

    return (
        <AppLayout>
            <Head title="Chapters" />
            <div className=" bg-primary min-h-screen pb-5">
            <div className=" bg-primary h-[200px]"></div>
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900">Chapters</h1>
                </div>
            </header>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {flash?.success && (
                        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded">
                            {flash.success}
                        </div>
                    )}

                    <div className="flex justify-between mb-6">
                        <h2 className="text-lg font-medium">All Chapters by Subject → Topic</h2>
                        <Link href={route('admin.chapters.create')} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                            Add Chapter
                        </Link>
                    </div>

                    <div className="space-y-10">
                        {subjects.map(subject => (
                            <div key={subject.id} className="bg-white shadow overflow-hidden sm:rounded-lg">
                                <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-indigo-100 border-b">
                                    <h3 className="text-xl font-bold text-indigo-900">{subject.name}</h3>
                                </div>

                                {subject.topics.map(topic => (
                                    <div key={topic.id} className="border-b last:border-b-0">
                                        <div className="px-6 py-3 bg-gray-50 font-medium text-gray-800">
                                            {topic.name}
                                        </div>

                                        <table className="min-w-full divide-y divide-gray-200 table-fixed">
    <thead className="bg-gray-50">
        <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase col-name">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase col-order">Order</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase col-actions">Actions</th>
        </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
        {topic.chapters.map(chapter => (
            <tr key={chapter.id}>
                <td className="px-6 py-4 text-sm text-gray-900 col-name">{chapter.name}</td>
                <td className="px-6 py-4 text-sm text-gray-900 col-order">{chapter.order}</td>
                <td className="px-6 py-4 text-sm col-actions">
                    <Link href={route('admin.chapters.edit', chapter.id)} className="text-indigo-600 hover:text-indigo-900">Edit</Link>
                    <span className="mx-2">|</span>
                    <Link href={route('admin.chapters.destroy', chapter.id)} method="delete" as="button" className="text-red-600 hover:text-red-900">Delete</Link>
                </td>
            </tr>
        ))}
    </tbody>
</table>
                                    </div>
                                ))}

                                {subject.topics.length === 0 && (
                                    <div className="px-6 py-4 text-sm text-gray-500 text-center">
                                        No topics in this subject.
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            </div>
        </AppLayout>
    );
}