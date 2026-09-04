import { Link } from "@inertiajs/react";
import logo_footer  from "../assets/icons/logo_footer.svg"
import copy_right from "../assets/icons/copy_right.svg";
import X from "../assets/icons/X.svg";
import faceBook from "../assets/icons/faceBook.svg";
import instagram from "../assets/icons/instagram.svg";
import tiktok from "../assets/icons/tiktok.svg";

export default function Footer(){
    

    return (
        
      <>
          <div className="lg:hidden md:hidden bg-Backgroundfooter w-full  flex flex-col gap-7 justify-center items-center pt-8 text-primary">
           

            <div className=""> 
                <Link href="/">
                 <img src={logo_footer}  />
                </Link>
            </div>
            <div className="flex gap-10 ">
                <Link href="/Syllabus">Syllabus</Link>
                <Link href="/About">About</Link>
            </div>
            <div className="flex gap-10">
                <Link><img src={X} className="w-6" /> </Link>
               {/* <Link> <img src={faceBook} className="w-6"  /> </Link>*/}
                <Link> <img src={instagram} className="w-6"  /> </Link>
               {/* <Link> <img src={tiktok} className="w-6"  /> </Link>*/}
            </div>
            <div className=" flex justify-center items-center "> 
                <img  src={copy_right} className="" /> 
            </div>

            

          </div>  
           <div className="hidden md:hidden bg-Backgroundfooter w-full  lg:flex flex-col gap-10 justify-center items-center pt-16 pb-12 text-primary text-2xl">
           

           <div className=""> 
               <Link href="/">
                <img src={logo_footer}  className="w-48" />
               </Link>
           </div>
           <div className="flex gap-80 ">
               <Link href="/Syllabus">Syllabus</Link>
               <Link href="/About">About</Link>
           </div>
           <div className="flex gap-40">
               <Link><img src={X} className="w-10" /> </Link>
               {/* <Link> <img src={faceBook} className="w-6"  /> </Link>*/}
                <Link> <img src={instagram} className="w-9"  /> </Link>
               {/* <Link> <img src={tiktok} className="w-6"  /> </Link>*/}
           </div>
           <div className=" flex justify-center items-center "> 
               <img  src={copy_right} className="w-60" /> 
           </div>
           </div>

           <div className="hidden lg:hidden bg-Backgroundfooter w-full  md:flex flex-col gap-10 justify-center items-center pt-16 pb-12 text-primary text-xl">
           

           <div className=""> 
               <Link href="/">
                <img src={logo_footer}  className="w-40" />
               </Link>
           </div>
           <div className="flex gap-32 ">
               <Link href="/Syllabus">Syllabus</Link>
               <Link href="/About">About</Link>
           </div>
           <div className="flex gap-32">
               <Link><img src={X} className="w-10" /> </Link>
               {/* <Link> <img src={faceBook} className="w-6"  /> </Link>*/}
                <Link> <img src={instagram} className="w-9"  /> </Link>
               {/* <Link> <img src={tiktok} className="w-6"  /> </Link>*/}
           </div>
           <div className=" flex justify-center items-center "> 
               <img  src={copy_right} className="w-48" /> 
           </div>

         </div>  

         </> 
    )
 }

