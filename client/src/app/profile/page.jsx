"use client";

import { useEffect, useState } from "react";
import AgentProfile from "@/components/profile/AgentProfile";
import AdminProfile from "@/components/profile/AdminProfile";
import UserProfile from "@/components/profile/UserProfile";
import ProfileEditForm from "@/components/profile/ProfileEditForm";
import ChangePasswordForm from "@/components/profile/ChangePasswordForm";

export default function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = () => {
      const stored = localStorage.getItem("user");
      if (stored) setUser(JSON.parse(stored));
    };

    loadUser(); // initial
    window.addEventListener("auth-change", loadUser);

    return () => {
      window.removeEventListener("auth-change", loadUser);
    };
  }, []);

  if (!user) return null;

  const handleAvatarUpdate = (avatar) => {
    const updated = { ...user, avatar };
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
    window.dispatchEvent(new Event("auth-change"));
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#224434] via-slate-900 to-[#36819e]">
      {/* Overlay */}
      <div className="min-h-screen bg-black/30">
        <div className="max-w-5xl mx-auto px-6 py-10">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">My Profile</h1>
            <p className="text-gray-300 text-sm mt-1">
              Manage your account information and preferences
            </p>
          </div>

          {/* Profile Card */}
          <div className="bg-[#B7E5CD] rounded-2xl shadow-2xl p-8 mb-4">
            {user.role === "agent" && (
              <AgentProfile user={user} onAvatarUpdate={handleAvatarUpdate} />
            )}
            {user.role === "admin" && (
              <AdminProfile user={user} onAvatarUpdate={handleAvatarUpdate} />
            )}
            {user.role === "user" && (
              <UserProfile user={user} onAvatarUpdate={handleAvatarUpdate} />
            )}
            
          </div>
          
          {/* Edit Forms */}
          <div className="bg-[#DDF4E7] rounded-2xl shadow-2xl p-8 space-y-6">
            <ProfileEditForm user={user} onUserUpdate={setUser} />
            <ChangePasswordForm />
          </div>
        </div>
      </div>
    </main>
  );
}
