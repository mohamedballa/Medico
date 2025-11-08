// resources/js/Pages/Admin/Folios/Index.jsx
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Index({ module }) {
    const { flash } = usePage().props;

    return (
        <AppLayout>
            <Head title={`Folios - ${module.name}`} />
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
                                    Folios in <span className="text-indigo-600">{module.name}</span>
                                </h1>
                                <p className="text-sm text-gray-600">
                                    {module.chapter.topic.subject.name} → {module.chapter.topic.name} → {module.chapter.name}
                                </p>
                            </div>
                            <Link
                                href={route('admin.folios.create') + `?module=${module.id}`}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                            >
                                + Add Folio
                            </Link>
                        </div>

                        {module.folios.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <p className="text-lg mb-4">No folios yet.</p>
                                <Link
                                    href={route('admin.folios.create') + `?module=${module.id}`}
                                    className="text-indigo-600 hover:underline"
                                >
                                    Create your first folio
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {module.folios.map(folio => (
                                    <div key={folio.id} className="border rounded-lg p-5 bg-gray-50 shadow-sm">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800">{folio.title}</h3>
                                                <p className="text-sm text-gray-600">Order: {folio.order}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Link
                                                    href={route('admin.folios.edit', folio.id)}
                                                    className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                                                >
                                                    Edit
                                                </Link>
                                                <Link
                                                    href={route('admin.folios.destroy', folio.id)}
                                                    method="delete"
                                                    as="button"
                                                    className="text-red-600 hover:text-red-900 text-sm font-medium"
                                                >
                                                    Delete
                                                </Link>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <strong className="text-sm text-gray-700">Slides ({folio.slides.length})</strong>
                                        </div>

                                        {/* Add Slide Button */}
                                        <Link
                                            href={route('admin.folio-slides.create') + `?folio=${folio.id}`}
                                            className="inline-block mb-3 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                                        >
                                            + Add Slide
                                        </Link>

                                        {/* Slide List */}
                                        {folio.slides.length > 0 && (
                                            <div className="space-y-2">
                                                {folio.slides.map((slide, i) => (
                                                    <div key={slide.id} className="flex justify-between items-center p-3 bg-white rounded border">
                                                        <div>
                                                            <span className="font-medium">Slide {i + 1}</span>
                                                            <span className="ml-2 text-xs text-gray-500">(Order: {slide.order})</span>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Link
                                                                href={route('admin.folio-slides.edit', slide.id)}
                                                                className="text-indigo-600 hover:underline text-xs"
                                                            >
                                                                Edit
                                                            </Link>
                                                            <Link
                                                                href={route('admin.folio-slides.destroy', slide.id)}
                                                                method="delete"
                                                                as="button"
                                                                className="text-red-600 hover:underline text-xs"
                                                            >
                                                                Delete
                                                            </Link>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
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