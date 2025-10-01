import {useForm, Head, Link } from "@inertiajs/react";


export default function Login() {

    const { data, setData, post, processing, errors } = useForm({
        email: "",
        password: "",
        remember:false,
      });

      const handleSubmit = (e) => {
        e.preventDefault();
        post("/login");
      };

    return (
        <>
        <Head  title="Login" />
        <div className=" bg-primary min-h-screen">
        <div className=" bg-primary h-[200px]"></div>
        <form onSubmit={handleSubmit} className=" mx-auto mb-64 space-y-4 ">
           <div className=" max-w-md mx-auto"> 
           <div className="mb-5 font-SpecHeadline text-white text-center font-extralight letters ]">
            <h1 className="text-center   text-4xl  ">LOGIN</h1>
            <p className=" text-[15px] mt-2">Not A Member ? <Link href="/Signup" className="font-bold">Signup</Link></p>
           </div>
           <div className=" bg-white rounded-xl p-16 space-y-5 m-10 sm:w-full sm:mx-auto">

        
      <div className=" text-sm font-SpecHeadline text-Headline">
        <label className="md:text-lg font-light">Email</label>
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
        <label className="md:text-lg font-light">Password</label>
      <input
        type="password"
        placeholder="Password"
        value={data.password}
        onChange={(e) => setData("password", e.target.value)}
        className="border p-2 w-full shadow-md"
      />
      {errors.password && <div className="text-red-500">{errors.password}</div>}
      </div> 

      <div className="flex justify-center items-center">
      <div className="flex  w-full  space-x-2 font-SpecHeadline text-xs   ">
        <input
            type="checkbox"
            id="remember"
            checked={data.remember || false}
            onChange={(e) => setData("remember", e.target.checked)}
            className="w-2 clicked:bg-primary"
            />
        <label htmlFor="remember" className="text-Headline">Remember Me</label>
        </div>
        
          <Link href={route('password.request')} className="text-primary text-[12px] whitespace-nowrap ">
              Forgot your password?
          </Link>

      
            </div>

      
      <button disabled={processing} className={`bg-primary w-full text-white px-4 py-2 font-SpecHeadline rounded-md shadow-xl`}>
        LOGIN
      </button>

      </div>
      </div>
    </form>
        </div>
        </>
    );
}
