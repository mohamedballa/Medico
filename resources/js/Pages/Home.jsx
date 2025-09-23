import {usePage , Head, Link } from "@inertiajs/react";
import Hero  from '../assets/icons/Hero-large.svg?react';


export default function Home() {
    
    const component =  usePage();
    return (
        <> 
        <div className="bg-white">
            <Head  title="Home"  />
            <img src={Hero}  className="" />
            <Hero className=" max-w-full  " />
            <h1 className=" bg-red-300 text-9xl  w-full sm:w-1/4 md:w-1/2 lg:w-3/4 ">
                Home
            </h1>
        </div>  
        </>
    );
}
