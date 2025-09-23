import {usePage , Head, Link } from "@inertiajs/react";



export default function Home() {
    
    const component =  usePage();
    return (
        <>   
        <Head  title="Home"  />
       
        <h1 className=" bg-red-300 text-9xl  w-full sm:w-1/4 md:w-1/2 lg:w-3/4 ">
            Home
        </h1>
        </>
    );
}
