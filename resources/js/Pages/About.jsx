import {usePage , Head, Link } from "@inertiajs/react";
import MedicoMissionstatement from  '../assets/images/Medico-Mission-statement.png';



export default function About() {
    return (
        <>
        <Head title="About" />
        <div className=" bg-primary min-h-screen">
        <div className=" bg-primary h-[200px]"></div>

        {/* <h1 className=" text-9xl  w-full sm:w-1/4 md:w-1/2 lg:w-3/4 ">
            About
        </h1> */}
        <div>
            <img  src={MedicoMissionstatement} />
        </div>
        </div>
        </>
    );
}
