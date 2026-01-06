// "use client";

// import { useState } from "react";
// import { useLoginMutation } from "@/features/users/userApi";
// import { useRouter } from "next/navigation";
// import Link from "next/link";

// export default function LoginPage() {
//   const router = useRouter();
//   const [login, { isLoading, isError }] = useLoginMutation();

//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//   });

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await login(form).unwrap();

//       localStorage.setItem("token", res.token);
//       localStorage.setItem("user", JSON.stringify(res));

//       // ✅ NOTIFY NAVBAR
//       window.dispatchEvent(new Event("auth-change"));

//       router.push("/properties");
//     } catch (err) {}
//   };

//   return (
//     <main className="min-h-screen flex items-center justify-center p-4">
//       <form
//         onSubmit={handleSubmit}
//         className="w-full max-w-md border rounded-lg p-6 space-y-4"
//       >
//         <h1 className="text-2xl font-bold text-center">Login</h1>

//         {isError && (
//           <p className="text-red-500 text-sm text-center">
//             Invalid credentials
//           </p>
//         )}

//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           value={form.email}
//           onChange={handleChange}
//           required
//           className="w-full border rounded p-2"
//         />

//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={form.password}
//           onChange={handleChange}
//           required
//           className="w-full border rounded p-2"
//         />

//         <button
//           disabled={isLoading}
//           className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
//         >
//           {isLoading ? "Logging in..." : "Login"}
//         </button>

//         <p className="text-center text-sm">
//           Don’t have an account?{" "}
//           <a href="/register" className="text-blue-600">
//             Register
//           </a>
//         </p>
//         <Link
//           href="/forgot-password"
//           className="text-sm text-indigo-600 hover:underline"
//         >
//           Forgot password?
//         </Link>
//       </form>
//     </main>
//   );
// }


"use client";

import { useState } from "react";
import PasswordLogin from "@/components/auth/PasswordLogin";
import OtpLogin from "@/components/auth/OtpLogin";
export default function LoginPage() {
  const [mode, setMode] = useState("password");

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="space-y-6">
        {/* Toggle */}
        <div className="flex justify-center gap-4 text-sm">
          <button
            onClick={() => setMode("password")}
            className={mode === "password" ? "font-semibold" : ""}
          >
            Password Login
          </button>
          <button
            onClick={() => setMode("otp")}
            className={mode === "otp" ? "font-semibold" : ""}
          >
            OTP Login
          </button>
        </div>

        {mode === "password" ? <PasswordLogin /> : <OtpLogin />}
      </div>
    </main>
  );
}

