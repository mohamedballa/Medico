import { Link } from "@inertiajs/react";

export default function Layout({children}){
    return (
        <>
            <header>
                <nav>
                    <div>
                        
                        <div>
                            {/* <img src="" alt="" /> */}
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