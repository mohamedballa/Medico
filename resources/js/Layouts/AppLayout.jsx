import { Link } from "@inertiajs/react";
import Logo from '../assets/images/logo.png';
import NavLink from "../components/NavLink";
import Navbar from "../components/Navbar";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

export default function AppLayout({ children }) {
    return (
        <>
            <div className="flex flex-col min-h-screen">
                <Nav />
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </>
    );
}