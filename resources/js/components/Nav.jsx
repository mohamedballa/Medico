import { Link } from "@inertiajs/react";
import Logo from '../assets/images/logo.png';
import NavLink from "../components/NavLink";

export default function Nav(){




        return(

            <header className=" bg-white p-3 text-Headline border-gray-300  border-b-2 shadow-lg font-SpecHeadline font-light text-xl">
                <nav className="">
                    <div className=" m-5  flex items-center justify-between ">
                        
                        <div className=" flex-shrink-0">
                            <img src={Logo} alt="Logo" className="h-10 w-auto" />
                        </div>
                        <div className=" align-items-center flex gap-20 ">
                           <NavLink  href="/">Home</NavLink>
                           <NavLink  href="/Syllabus">Syllabus</NavLink>
                           <NavLink  href="/About">About</NavLink>
                        </div>
                        <div className=" flex space-x-9">
                            <Link className="hover:text-primary" href="/Signup" >Signup</Link>
                            <Link className="hover:text-primary" href="/Login" >Login</Link>
                        </div>
                   
                    </div>
                </nav>
            </header> 
        
        )}