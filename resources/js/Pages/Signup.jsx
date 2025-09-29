import {useForm, Head, Link } from "@inertiajs/react";
import { useState } from "react";





export default function Signup() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
      });
      const [agreed, setAgreed] = useState(false);

      const handleCheckSubmit = (e) => {
          e.preventDefault();
  
          if (!agreed) {
              alert("You must agree to the Terms & Conditions before signing up.");
              return;
          }
        }
    


      const handleSubmit = (e) => {
        e.preventDefault();
        post("/signup");
      };
    

    return (
        <>
        <Head title="Signup" />
        <div className=" bg-primary min-h-screen p-1">
        <div className=" bg-primary h-[200px]"></div>
        {/* <h1 className=" text-9xl  w-full sm:w-1/4 md:w-1/2 lg:w-3/4">
            Signup
        </h1> */}
        
        <form onSubmit={handleSubmit} className=" mx-auto mb-64 space-y-4 ">
           <div className=" max-w-md mx-auto"> 
           <div className="mb-5 font-SpecHeadline text-white text-center font-extralight letters">
            <h1 className="text-center   text-4xl  ">SIGN UP</h1>
            <p className=" text-[15px] mt-2">A Member ? <Link href="/Login" className="font-bold">Login</Link></p>
           </div>
           <div className=" bg-white rounded-xl p-16 space-y-5 m-10 ">

         <div className="text-sm font-SpecHeadline text-Headline"> 
        <label className="font-light">Name</label>
      <input
        type="text"
        placeholder="Name.."  
        value={data.name}
        onChange={(e) => setData("name", e.target.value)}
        className="border p-2 w-full shadow-md"
      />
      {errors.name && <div className="text-red-500">{errors.name}</div>}
      </div>  
      <div className=" text-sm font-SpecHeadline text-Headline">
        <label className=" font-light">Email</label>
      <input
        type="email"
        placeholder="Email.."
        value={data.email}
        onChange={(e) => setData("email", e.target.value)}
        className="border p-2 w-full shadow-md"
      />
      {errors.email && <div className="text-red-500">{errors.email}</div>}
      </div>  
      <div className="font-SpecHeadline text-Headline text-sm">
        <label className="font-light">Password</label>
      <input
        type="password"
        placeholder="Password"
        value={data.password}
        onChange={(e) => setData("password", e.target.value)}
        className="border p-2 w-full shadow-md"
      />
      {errors.password && <div className="text-red-500">{errors.password}</div>}
      </div>  
      <div className="font-SpecHeadline text-Headline text-sm">
      <label className=" md:text-lg font-light">Confirm Password</label>
      <input
        type="password"
        placeholder="Confirm Password"
        value={data.password_confirmation}
        onChange={(e) => setData("password_confirmation", e.target.value)}
        className="border p-2 w-full shadow-md"
      />
    </div>  
        <div className="w-full  flex gap-0 space-x-2 text-[10px] justify-center items-center">
            <input type="checkbox" id="terms"  checked={agreed} onChange={(e)=>setAgreed(e.target.checked)} className="w-2 bg-red-400"/>
            <label htmlFor="option1" ClassName="cursor-pointer  p-2  peer-checked:bg-primary">Agree to <span className="text-primary"><Link href="/Terms&Conditions">terms & conditions</Link></span></label>
        </div>
      
      <button disabled={processing} className="bg-primary w-full text-white px-4 py-2 font-SpecHeadline rounded-md shadow-xl">
        SIGN UP
      </button>

      </div>
      </div>
    </form>
    </div>
        </>
    );
}