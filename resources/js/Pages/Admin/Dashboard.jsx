// resources/js/Pages/Admin/Dashboard.jsx
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AppLayout>
            <Head title="Admin Dashboard" />
            <div className=" bg-primary min-h-screen pb-5">
            <div className=" bg-primary h-[200px]"></div>
            {/* Admin Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Admin Dashboard
                        </h1>
                        <div className="text-sm text-gray-500">
                            Welcome to MedicoSolomed Admin Panel
                        </div>
                    </div>
                </div>
            </header>

            {/* Dashboard Content */}
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Quick Actions Grid */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        
                        {/* Subjects Card */}
                        <Link
                            href={route('admin.subjects.index')}
                            className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900">Subjects</h3>
                                    <p className="text-sm text-gray-500">Manage subjects and curriculum</p>
                                </div>
                            </div>
                        </Link>

                        {/* Topics Card */}
                        <Link href={route('admin.topics.index')} className="group bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                            <div className="flex items-center ">
                                <div className="flex-shrink-0">
                                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600">
                                        Topics
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-600">Manage topics</p>
                                </div>
                                
                            </div>
                        </Link>
                        {/* Chapters Card */}
                        <Link
                            href={route('admin.chapters.index')}
                            className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900">Chapters</h3>
                                    <p className="text-sm text-gray-500">Organize chapters by subject</p>
                                </div>
                            </div>
                        </Link>

                        {/* Modules Card */}
                        <Link
                            href={route('admin.modules.index')}
                            className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900">Modules</h3>
                                    <p className="text-sm text-gray-500">Create learning modules</p>
                                </div>
                            </div>
                        </Link>

                    </div>

                    {/* Stats Row (Optional - Add later) */}
                    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-medium text-gray-500">Total Subjects</h3>
                            <p className="text-2xl font-semibold text-gray-900">3</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-medium text-gray-500">Total Topics</h3>
                            <p className="text-2xl font-semibold text-gray-900">3</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-medium text-gray-500">Total Chapters</h3>
                            <p className="text-2xl font-semibold text-gray-900">6</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-medium text-gray-500">Total Modules</h3>
                            <p className="text-2xl font-semibold text-gray-900">18</p>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </AppLayout>
    );
}