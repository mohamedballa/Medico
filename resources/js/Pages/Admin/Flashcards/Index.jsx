import { Link } from '@inertiajs/react';
import AdminPage, { moduleTrail } from '@/components/Admin/AdminPage';

export default function Index({ module }) {
    const createHref = route('admin.flashcards.create', { module: module.id });

    return (
        <AdminPage
            title={`Flashcards - ${module.name}`}
            heading={<>Flashcards in <span className="text-indigo-600">{module.name}</span></>}
            subheading={moduleTrail(module)}
            actions={
                <Link href={createHref} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    + Add Flashcard
                </Link>
            }
        >
            {module.flashcards.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    <p className="text-lg mb-4">No flashcards yet.</p>
                    <Link href={createHref} className="text-indigo-600 hover:underline">
                        Create your first flashcard
                    </Link>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Front</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Back</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hint</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {module.flashcards.map((card) => (
                                <tr key={card.id}>
                                    <td className="px-6 py-4 text-sm text-gray-900">{card.order}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{card.front}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{card.back}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{card.hint ?? '—'}</td>
                                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                                        <Link href={route('admin.flashcards.edit', card.id)} className="text-indigo-600 hover:text-indigo-900">
                                            Edit
                                        </Link>
                                        {' | '}
                                        <Link
                                            href={route('admin.flashcards.destroy', card.id)}
                                            method="delete"
                                            as="button"
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </AdminPage>
    );
}
