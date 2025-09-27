import {usePage , Head, Link } from "@inertiajs/react";
import Hero from '../assets/images/Mobile_Hero.png';
import MHButton from '../assets/images/MHButton.png';
import MSyllabus from '../assets/images/MSyllabus.png';
import HSyllabus from '../assets/images/HSyllabus.png';
import SButton from '../assets/images/SButton.png';
import MButton from '../assets/images/MButton.png';
import Subscribtions from '../assets/images/Subscribtions.png';
import Subscribe from '../assets/images/Subscribe.png';
import Signup from '../assets/images/Signup.png';


export default function Home() {
    
    const component =  usePage();
    return (
        <> 
            <Head  title="Home"  />
            
            {/* Mobile  */}
             <div className="lg:hidden md:hidden bg-white space-y-20 mt-44 min-h-screen ">
                

                <div className="relative w-full">
                   
                    <img src={Hero} className="w-full h-auto object-contain" alt="Hero" />
                    
                    <Link href="/Demo">
                        <img src={MHButton} alt="Button" className="absolute bottom-12 left-10 w-32 " />
                    </Link>
                    
                </div>


                <div className="relative w-full">
                    <img  src={HSyllabus} alt="Syllabus" />

                    <Link href="Syllabus">
                       <img  src={SButton} alt="Button" className="w-28 absolute bottom-[7%] left-[33%]" />
                    </Link>
                </div>
                <div className="relative w-full">
                    <img  src={MSyllabus} alt="Module" className="" />

                    <Link href="/Demo">
                     <img src={MButton} alt="Button" className="absolute bottom-[7%] left-[33%] w-32 "  />
                    </Link>
                </div>



                <div className="relative w-full">
                    <img src={Subscribtions} alt="subscritptions" className=" mb-20"  />
                    <Link href="/Subscribe">
                     <img src={Subscribe} alt="Button" className="absolute top-[55%] left-[33%] w-32 "  />
                    </Link>

                    <Link href="/Signup">
                     <img src={Signup} alt="Button" className="absolute bottom-[10%] left-[36%]   w-28"  />
                    </Link>
                </div>

            
             </div>  


              {/* Tablet  */}













              {/* Desktop  */}
        </>
    );
}
