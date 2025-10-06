import { useForm, Head } from "@inertiajs/react";
import { route } from 'ziggy-js';

export default function ForgotPassword() {
  const { data, setData, post, processing, errors } = useForm({ email: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route("password.email"));
  };

  return (
    <>
      <Head title="Forgot Password" />
      <div className=" bg-primary min-h-screen">
        <div className=" bg-primary h-[200px]"></div>
      <form onSubmit={handleSubmit} className="space-y-4 w-[25%] mx-auto ">
        <input
          type="email"
          value={data.email}
          onChange={(e) => setData("email", e.target.value)}
          placeholder="Enter your email"
          className="border p-2 w-full"
        />
        {errors.email && <div className="text-red-500">{errors.email}</div>}
        <button disabled={processing} className="bg-blue-500 text-white px-4 py-2 ">
          Send Reset Link
        </button>
      </form>
      </div>
    </>
  );
}
