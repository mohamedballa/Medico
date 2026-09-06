import AppLayout from '@/Layouts/AppLayout';
import { Head, usePage } from '@inertiajs/react';

/**
 * Shared chrome for admin screens: layout, page title, flash messages and a
 * white content card on the primary background.
 */
export default function AdminPage({ title, heading, subheading, actions, widthClass = 'max-w-7xl', children }) {
    const { flash } = usePage().props;

    return (
        <AppLayout>
            <Head title={title} />
            <div className="bg-primary min-h-screen pb-5">
                <div className="h-[200px]" />
                <div className="py-12">
                    <div className={`${widthClass} mx-auto px-4 sm:px-6 lg:px-8`}>
                        {flash?.success && (
                            <div role="status" className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
                                {flash.success}
                            </div>
                        )}
                        {flash?.error && (
                            <div role="alert" className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
                                {flash.error}
                            </div>
                        )}

                        <div className="bg-white shadow rounded-lg p-6">
                            {(heading || actions) && (
                                <div className="flex justify-between items-start gap-4 mb-6">
                                    <div>
                                        {heading && <h1 className="text-2xl font-bold text-gray-900">{heading}</h1>}
                                        {subheading && <p className="text-sm text-gray-600">{subheading}</p>}
                                    </div>
                                    {actions}
                                </div>
                            )}
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

/** "Subject → Topic → Chapter" trail for a module, tolerant of missing relations. */
export function moduleTrail(module) {
    const chapter = module?.chapter;
    return [chapter?.topic?.subject?.name, chapter?.topic?.name, chapter?.name].filter(Boolean).join(' → ');
}
