import {usePage , Head, Link } from "@inertiajs/react";
import Hero from '../assets/icons/Hero-large.svg';
import Button from '../assets/icons/Button.svg';


export default function Home() {
    
    const component =  usePage();
    return (
        <> 
        <div className="bg-white space-y-20 mt-20">
            <Head  title="Home"  />
            <div className="">
                <img src={Hero}  className="max-w-full" />
                <div className="relative">

                <Link href="#" className="absolute bottom-1/2 flex items-end mb-14 ml-12"> <img src={Button} alt="Button" className="hover:brightness-75" /> </Link>
                </div>
            </div>

            <h1 className=" bg-red-300 text-9xl  w-full sm:w-1/4 md:w-1/2 lg:w-3/4 ">
                Home
            </h1>
        </div>  
        </>
    );
}
