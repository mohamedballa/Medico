import { Head,useForm,  Link } from "@inertiajs/react";
import React , {useState} from "react";
import { route } from 'ziggy-js';

export default function VerifyNotice({email}) {
  const [status , setStatus] = useState(null);

  

  const { post, processing ,data , setData } = useForm({
    email:email || " "
  });

  function resend() {
    post(route('verification.resend') ,{
      onSuccess: () => setStatus("Verification link sent to your email!"),
    }); 
  }

  return (
    <>
      <Head title="Verify your email" />
      <div className=" bg-primary min-h-screen">
        <div className=" bg-primary h-[200px]"></div>
        
        <div className="bg-white border text-Headline font-SpecHeadline">
      
       
            <h1 className="text-center text-2xl mt-10">Verify your email</h1>    
            <p className="text-center m-5 text-xl ">
          A verification link was sent to{" "}  <strong>{email || "your email address"}</strong>. Please check your inbox.
        </p>
        {status && (
          <div className="mb-4 text-green-600 text-center">{status}</div>
        )} 
    
        <div className="flex justify-around  items-center m-10 text-xl ">
          <button
            onClick={resend}
            disabled={processing}
            className="bg-primary text-white px-4 py-2 rounded"
          >
            Resend verification email
          </button>
        <button  className="bg-primary text-white px-4 py-2 rounded">

          <Link href="/login" className=" text-xl  text-white self-center">Back to Login</Link>
        </button>
        </div>
      </div>
      </div>
    
      
    </>
  );
}

