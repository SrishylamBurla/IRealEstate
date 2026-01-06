"use client";

import { useState } from "react";
import { useChangePasswordMutation } from "@/features/users/userApi";

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changePassword, { isLoading }] =
    useChangePasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await changePassword({
        currentPassword,
        newPassword,
      }).unwrap();

      alert("✅ Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      alert(err?.data?.message || "Failed to change password");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full space-y-4 bg-white p-6 rounded-xl shadow"
    >
      <h3 className="text-lg font-semibold">Change Password</h3>

      <input
        type="password"
        placeholder="Current password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />

      <input
        type="password"
        placeholder="New password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />

      <p className="text-xs text-gray-500">
        Minimum 8 characters, must include a number
      </p>

      <button
        disabled={isLoading}
        className="bg-indigo-600 text-white px-4 py-2 rounded w-full"
      >
        {isLoading ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
}
