import { useState } from "react";
import { Link , usePage } from "@inertiajs/react";
import Logo from '../assets/images/logo.png';
import NavLink from "../components/NavLink";
import  close   from "../assets/icons/close.svg";
import  menu   from "../assets/icons/menu.svg";
import { route } from "ziggy-js";


export default function Nav(){

    const [open, setOpen] = useState(false);

   const handleClose = () => setOpen(false);

   const{ auth } = usePage().props;

        return(

            <header className=" fixed top-0 left-0 w-full bg-white  text-Headline border-gray-300  border-b-2 shadow-lg font-SpecHeadline font-light text-xl z-50">
                <nav className="">
                    <div className="m-5  flex items-center justify-between">
                        {/* Logo */}

                        <div className=" flex-shrink-0 ">
                            <Link href="/">
                        <img src={Logo} alt="Logo" className="h-9 md:h-12" />
                            </Link>
                        </div>
                        {/* Desktop */}
                        <div className="hidden lg:flex flex-1 items-center justify-between " >

                            <div className="flex gap-16 mx-auto ">
                                <NavLink  href="/">Home</NavLink>
                                <NavLink  href="/Syllabus">Syllabus</NavLink>
                                <NavLink  href="/About">About</NavLink>
                            </div>
                            <div className="flex gap-8  mr-10  ">
                                {auth.user ? (
                                    <>
                                    <NavLink href="/dashboard" className="hover:text-primary">Dashboard</NavLink>
                                    <Link href="/logout" method="post" as="button" className="hover:text-primary mt-4">Logout</Link>
                                    </>):(<>
                                <NavLink className="hover:text-primary" href="/signup" >Signup</NavLink>
                                <NavLink className="hover:text-primary" href="/login" >Login</NavLink>
                            </>)}</div>

                        </div>


                        {/* Mobile */}
                        <div className="lg:hidden">
                            <button
                                onClick={() => setOpen(!open)}
                                className=""
                                >
                                {open ?  <img src={close} className="w-12 md:w-16 "   /> : <img src={menu} className="w-12 md:16" />}
                            </button>
                        </div>
                    </div>
                            {open && (
                                <div className="lg:hidden  bg-white border-t border-gray-200 divide-y shadow-md pb-4">
                                    <div className="flex flex-col mt-4 space-y-4 ">
                                            
                                        <div className="border-b border-gray-300 pb-4 text-center">
                                          <NavLink  href="/" className="" onClick={handleClose} >Home</NavLink>
                                        </div>
                                        <div className="border-b border-gray-300 pb-4 text-center">
                                          <NavLink  href="/Syllabus" onClick={handleClose} >Syllabus</NavLink>
                                        </div>
                                        <div className=" text-center">
                                          <NavLink  href="/About" onClick={handleClose} >About</NavLink> 
                                        </div>
                                    </div>
                                    <div className="flex justify-around mt-4 mb-1">
                                    {auth.user ? (
                                    <>
                                    <NavLink href="/dashboard" className="hover:text-primary " onClick={handleClose} >Dashboard</NavLink>
                                    <Link href="/logout" method="post" as="button" className="hover:text-primary mt-4 ">Logout</Link>
                                    </>):(<>
                                <NavLink className="hover:text-primary mt-4" href="/signup" onClick={handleClose} >Signup</NavLink>
                                <NavLink className="hover:text-primary mt-4" href="/login" onClick={handleClose} >Login</NavLink>
                            </>)} 
                                    </div>
                                </div>
                            )}
                </nav>
            </header> 
        
        )}


 