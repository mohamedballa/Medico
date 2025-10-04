import { Head, usePage, Link } from "@inertiajs/react";
import { useForm } from "@inertiajs/react";
import { route } from 'ziggy-js';

export default function VerifyNotice() {
  const { flash, auth } = usePage().props;
  const { post, processing } = useForm();

  function resend() {
    post(route('verification.resend')); // Ziggy route helper; or use '/email/verification-notification'
  }

  return (
    <>
      <Head title="Verify your email" />
      <div className=" bg-primary min-h-screen">
        <div className=" bg-primary h-[200px]"></div>
        
        <div className="bg-white border text-Headline font-SpecHeadline">
      
       
            <h1 className="text-center text-2xl mt-10">Verify your email</h1>    
            <p className="text-center m-5 text-xl ">
          A verification link was sent to <strong>{auth.user.email}</strong>. Please click the link in that email to verify your account.
        </p>
        {flash?.status && (
          <div className="mb-4 text-green-600 text-center">{flash.status}</div>
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

          <Link href="/" className=" text-xl  text-white self-center">Back to Home</Link>
        </button>
        </div>
      </div>
      </div>
    
      
    </>
  );
}

