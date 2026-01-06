"use client";

import { useState } from "react";
import { useUpdateProfileMutation } from "@/features/users/userApi";

export default function ProfileEditForm({ user, onUpdated }) {
  const [form, setForm] = useState({
    name: user.name || "",
    phone: user.phone || "",
    bio: user.bio || "",
  });

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updated = await updateProfile(form).unwrap();

    // 🔁 Sync everywhere
    localStorage.setItem("user", JSON.stringify(updated));
    window.dispatchEvent(new Event("auth-change"));
    onUpdated(updated);
    alert("Profile updated successfully!");
    setForm({
      name: updated.name || "",
      phone: updated.phone || "",
      bio: updated.bio || "",
    });
    
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-white p-6 shadow-md space-y-6"
    >
      <h3 className="text-lg font-semibold">Edit Profile</h3>

      {/* Name */}
      <Input
        label="Full Name"
        name="name"
        value={form.name}
        onChange={handleChange}
      />

      {/* Phone */}
      <Input
        label="Phone Number"
        name="phone"
        value={form.phone}
        onChange={handleChange}
        placeholder="+91 XXXXX XXXXX"
      />

      {/* Bio */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">Bio</label>
        <textarea
          name="bio"
          rows={4}
          value={form.bio}
          onChange={handleChange}
          className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
          placeholder="Tell something about yourself..."
        />
      </div>

      <button
        disabled={isLoading}
        className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm disabled:opacity-50"
      >
        {isLoading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}

/* ---------------- UI ---------------- */

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1">{label}</label>
      <input
        {...props}
        className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}
