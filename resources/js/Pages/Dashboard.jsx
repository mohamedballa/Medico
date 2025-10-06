import {usePage , Head, Link } from "@inertiajs/react";



export default function Dashboard() {
    return (
        <>
        <Head title="Dashboard" />
        <div className="bg-primary min-h-screen">
        <div className=" bg-primary h-[150px]"></div>
        <h1 className=" pl-16 text-3xl mb-10 text-white font-SpecHeadline">
            Dashboard
        </h1>
        <hr className="border-gray-300 border-t" />
        </div>
        </>
    );
}
