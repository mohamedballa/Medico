import { Link } from "@inertiajs/react";
import Logo from '../assets/images/logo.png';
import NavLink from "../components/NavLink";
import Navbar from "../components/Navbar";
import Nav from "../components/Nav";


export default function Layout({children}){
    return (
        <>
            <div className="">
                    <Nav  />

                    <main>
                        {children}
                    </main>
            </div> 
        </>
    )
}