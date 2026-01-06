import { useState } from "react";
import { useLoginMutation } from "@/features/users/userApi";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PasswordLogin() {
  const router = useRouter();
  const [login, { isLoading, isError }] = useLoginMutation();   

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await login(form).unwrap();

      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res));

      // ✅ NOTIFY NAVBAR
      window.dispatchEvent(new Event("auth-change"));

      router.push("/");
    } catch (err) {}
  };

  return (
    <main className="min-w-md mx-auto flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md shadow-xl bg-gray-50 rounded-lg p-6 space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Login</h1>

        {isError && (
          <p className="text-red-500 text-sm text-center">
            Invalid credentials
          </p>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border rounded p-2"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full border rounded p-2"
        />

        <button
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-600">
            Register
          </a>
        </p>
        <Link
          href="/forgot-password"
          className="text-sm text-indigo-600 hover:underline"
        >
          Forgot password?
        </Link>
      </form>
    </main>
  );
}