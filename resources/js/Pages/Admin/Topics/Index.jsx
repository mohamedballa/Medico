import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Index({ subjects }) {
    const { flash } = usePage().props;

    return (
        <AppLayout>
            <Head title="Topics" />
            <div className=" bg-primary min-h-screen pb-5">
            <div className=" bg-primary h-[200px]"></div>
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900">Topics</h1>
                </div>
            </header>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {flash?.success && (
                        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded">
                            {flash.success}
                        </div>
                    )}

                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-medium text-white">All Topics by Subject</h2>
                        <Link href={route('admin.topics.create')} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                            Add Topic
                        </Link>
                    </div>

                    <div className="space-y-8">
                        {subjects.map(subject => (
                            <div key={subject.id} className="bg-white shadow overflow-hidden sm:rounded-lg">
                                <div className="px-6 py-4 bg-gray-50 border-b">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {subject.name}
                                    </h3>
                                </div>
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {subject.topics.map(topic => (
                                            <tr key={topic.id}>
                                                <td className="px-6 py-4 text-sm text-gray-900">{topic.name}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900">{topic.order}</td>
                                                <td className="px-6 py-4 text-sm">
                                                    <Link href={route('admin.topics.edit', topic.id)} className="text-indigo-600 hover:text-indigo-900">Edit</Link>
                                                    <span className="mx-2">|</span>
                                                    <Link href={route('admin.topics.destroy', topic.id)} method="delete" as="button" className="text-red-600 hover:text-red-900">Delete</Link>
                                                </td>
                                            </tr>
                                        ))}
                                        {subject.topics.length === 0 && (
                                            <tr>
                                                <td colSpan="3" className="px-6 py-4 text-sm text-gray-500 text-center">
                                                    No topics yet.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            </div>
        </AppLayout>
    );
}