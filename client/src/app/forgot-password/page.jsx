"use client";

import { useState } from "react";
import { useForgotPasswordMutation } from "@/features/users/userApi";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const [forgotPassword, { isLoading }] =
    useForgotPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await forgotPassword(email).unwrap();
      setSent(true);
    } catch {
      setSent(true); // 🔒 same response even on error
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        {/* Header */}
        <h1 className="text-2xl font-semibold text-gray-800">
          Forgot Password
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Enter your registered email to receive a reset link
        </p>

        {/* Success Message */}
        {sent ? (
          <div className="mt-6 rounded-lg bg-green-50 p-4 text-sm text-green-700">
            If this email exists, a password reset link has been sent.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              type="email"
              required
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />

            <button
              disabled={isLoading}
              className="w-full rounded-lg bg-indigo-700 py-2 text-white font-medium hover:bg-indigo-800 transition disabled:opacity-60"
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="mt-6 text-center text-sm">
          <Link
            href="/login"
            className="text-indigo-600 hover:underline"
          >
            Back to login
          </Link>
        </div>
      </div>
    </main>
  );
}
