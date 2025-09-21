import { Link } from "@inertiajs/react";

export default function Layout({children}){
    return (
        <>
            <header>
                <nav>
                    <div>
                        
                        <div>
                            <img src="" alt="" />
                        </div>
                        <div>
                           <Link href="/">Home</Link>
                           <Link href="/Syllabus">Syllabus</Link>
                           <Link href="/About">About</Link>
                        </div>
                        <div>
                            <button>Signup</button>
                            <button>Login</button>
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