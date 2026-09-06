import { Head, Link } from '@inertiajs/react';

const DEFAULT_MESSAGES = {
    403: 'You are not allowed to access this page.',
    404: 'The page you are looking for could not be found.',
    419: 'Your session has expired. Please refresh and try again.',
    429: 'Too many requests. Please slow down and try again shortly.',
    500: 'Something went wrong on our side. Please try again later.',
    503: 'We are down for maintenance. Please check back soon.',
};

export default function Error({ status = 500, message }) {
    const text = message ?? DEFAULT_MESSAGES[status] ?? DEFAULT_MESSAGES[500];

    return (
        <>
            <Head title={`Error ${status}`} />
            <div className="bg-primary min-h-screen flex items-center justify-center px-6 pt-44 pb-24">
                <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-10 text-center font-SpecHeadline">
                    <p className="text-6xl font-light text-primary">{status}</p>
                    <h1 className="mt-4 text-2xl text-Headline">{text}</h1>
                    <div className="mt-8 flex justify-center gap-4 text-sm">
                        <Link href="/" className="px-4 py-2 bg-primary text-white rounded-md shadow hover:bg-primary/90">
                            Go home
                        </Link>
                        <Link href="/login" className="px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary/10">
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
