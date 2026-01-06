"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useResetPasswordMutation } from "@/features/users/userApi";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [resetPassword, { isLoading }] =
    useResetPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Invalid or expired reset link.");
      return;
    }

    if (password.length < 8 || !/\d/.test(password)) {
      setError("Password must be at least 8 characters and include a number.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await resetPassword({ token, password }).unwrap();
      setSuccess(true);

      setTimeout(() => {
        router.push("/login");
      }, 2500);
    } catch {
      setError("Reset link is invalid or expired.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <h1 className="text-2xl font-semibold text-gray-800">
          Reset Password
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Create a new secure password
        </p>

        {success ? (
          <div className="mt-6 rounded-lg bg-green-50 p-4 text-sm text-green-700">
            Password reset successful. Redirecting to login…
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && (
              <p className="rounded bg-red-50 p-2 text-sm text-red-600">
                {error}
              </p>
            )}

            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-indigo-600 outline-none"
            />

            <input
              type="password"
              placeholder="Confirm password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-indigo-600 outline-none"
            />

            <button
              disabled={isLoading}
              className="w-full rounded-lg bg-indigo-700 py-2 text-white font-medium hover:bg-indigo-800 transition disabled:opacity-60"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
