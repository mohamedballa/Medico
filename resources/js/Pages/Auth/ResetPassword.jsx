import { useForm, Head } from "@inertiajs/react";

export default function ResetPassword({ token, email }) {
  const { data, setData, post, processing, errors } = useForm({
    token,
    email: email || "",
    password: "",
    password_confirmation: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route("password.update"));
  };

  return (
    <>
      <Head title="Reset Password" />
      <div className=" bg-primary min-h-screen">
        <div className=" bg-primary h-[200px]"></div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={data.email}
          onChange={(e) => setData("email", e.target.value)}
          placeholder="Email"
          className="border p-2 w-full"
        />
        <input
          type="password"
          value={data.password}
          onChange={(e) => setData("password", e.target.value)}
          placeholder="New password"
          className="border p-2 w-full"
        />
        <input
          type="password"
          value={data.password_confirmation}
          onChange={(e) => setData("password_confirmation", e.target.value)}
          placeholder="Confirm password"
          className="border p-2 w-full"
        />
        <button disabled={processing} className="bg-green-500 text-white px-4 py-2">
          Reset Password
        </button>
      </form>
      </div>
    </>
  );
}
