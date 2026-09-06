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
//  Tablet
import tabletHero from '../assets/images/tablet/tabletHero.png';
import tabletSyllabus from '../assets/images/tablet/tabletSyllabus.png';
import tabletSubscribtions from '../assets/images/tablet/tabletSubscribtions.png';
import tabletMSyllabus from '../assets/images/tablet/tabletMSyllabus.png';
//  Destop
import DHero from '../assets/images/desktop/DHero.png';
import DSyllabus from '../assets/images/desktop/DSyllabus.png';
import DMSyllabus from '../assets/images/desktop/DMSyllabus.png';

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
                        <img src={MHButton} alt="Button" className="absolute bottom-12 left-9 w-32 " />
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

                    <Link href="/signup">
                     <img src={Signup} alt="Button" className="absolute bottom-[10%] left-[36%]   w-28"  />
                    </Link>
                </div>

            
             </div>  


              {/* Tablet  */}

              <div className="hidden md:block lg:hidden bg-white space-y-20 mt-44 min-h-screen ">
                

                <div className="relative w-full">
                   
                    <img src={tabletHero} className="w-full h-auto object-contain" alt="Hero" />
                    
                    <Link href="/Demo">
                        <img src={MHButton} alt="Button" className="absolute bottom-12 left-12 w-36 " />
                    </Link>
                    
                </div>


                <div className="relative w-full">
                    <img  src={tabletSyllabus} alt="Syllabus" />

                    <Link href="Syllabus">
                       <img  src={SButton} alt="Button" className="w-28 absolute bottom-[20%] left-[65%]" />
                    </Link>
                </div>
                <div className="relative w-full">
                    <img  src={tabletMSyllabus} alt="Module" className="" />

                    <Link href="/Demo">
                     <img src={MButton} alt="Button" className="absolute bottom-[15%] left-[64%] w-24 "  />
                    </Link>
                </div>



                <div className="relative w-full">
                    <img src={tabletSubscribtions} alt="subscritptions" className=" mb-20"  />
                    <Link href="/Subscribe">
                     <img src={Subscribe} alt="Button" className="absolute top-[77%] left-[20%] w-32 "  />
                    </Link>

                    <Link href="/signup">
                     <img src={Signup} alt="Button" className="absolute bottom-[15%] left-[65%]  w-28"  />
                    </Link>
                </div>

            
             </div>  


              {/* Desktop  */}
              <div className="hidden md:hidden lg:block bg-white space-y-20 mt-44 min-h-screen ">
                

                <div className="relative w-full">
                   
                    <img src={DHero} className="w-full h-auto object-contain" alt="Hero" />
                    
                    <Link href="/Demo">
                        <img src={MHButton} alt="Button" className="absolute bottom-16 left-20 w-48 " />
                    </Link>
                    
                </div>


                <div className="relative w-full">
                    <img  src={DSyllabus} alt="Syllabus" />

                    <Link href="Syllabus">
                       <img  src={SButton} alt="Button" className="w-32 absolute bottom-[20%] left-[66%]" />
                    </Link>
                </div>
                <div className="relative w-full">
                    <img  src={DMSyllabus} alt="Module" className="" />

                    <Link href="/Demo">
                     <img src={MButton} alt="Button" className="absolute bottom-[13%] left-[63%] w-40 "  />
                    </Link>
                </div>



                <div className="relative w-full">
                    <img src={tabletSubscribtions} alt="subscritptions" className=" mb-20"  />
                    <Link href="/Subscribe">
                     <img src={Subscribe} alt="Button" className="absolute top-[80%] left-[22%] w-40 "  />
                    </Link>

                    <Link href="/signup">
                     <img src={Signup} alt="Button" className="absolute bottom-[12%] left-[66%]  w-32"  />
                    </Link>
                </div>

            
             </div>  
        </>

    );
}
