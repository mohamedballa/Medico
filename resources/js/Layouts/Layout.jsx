import { Link } from "@inertiajs/react";
import Logo from '../assets/images/logo.png';
import Icon  from '../assets/icons/ei_arrow-right.svg?react';


export default function Layout({children}){
    return (
        <>
            <header>
                <nav>
                    <div>
                        
                        <div>
                            <img src={Logo} alt="Logo" className="" />
                            <Icon className="w-9 text-white bg-primary" />
                        </div>
                        <div>
                           <Link href="/">Home</Link>
                           <Link href="/Syllabus">Syllabus</Link>
                           <Link href="/About">About</Link>
                        </div>
                        <div>
                            <Link href="/Signup" >Signup</Link>
                            <Link href="/Login" >Login</Link>
                        </div>
                   
                    </div>
                </nav>
            </header>

            <main>
                {children}
            </main>
        </>
    )
}