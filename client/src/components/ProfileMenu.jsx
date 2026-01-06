"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getDefaultAvatar } from "@/utils/getDefaultAvatar";

export default function ProfileMenu({ user }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // 🔒 Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  if (!user) {
    return <AvatarSkeleton size={28} />;
  }

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("auth-change"));
    router.push("/login");
  };

  return (
    <div ref={ref} className="relative">
      {/* Avatar Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full bg-white/10 px-2 py-1 hover:bg-white/20 transition"
      >
        <span className="absolute inset-0 rounded-full ring-2 ring-gray-600 animate-pulse" />
        <img
          src={user.avatar || getDefaultAvatar(user.role)}
          alt="avatar"
          className="h-7 w-7 rounded-full object-cover"
        />
        <span className="hidden md:flex text-sm text-white">{user.name.split(" ")[0]}</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-56 rounded-xl bg-white shadow-xl overflow-hidden z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b bg-gray-50">
            <p className="text-sm font-semibold text-gray-800">{user.name}</p>
            <p className="text-xs text-gray-500 capitalize">
              {user.role} account
            </p>
          </div>

          {/* Actions */}
          <div className="text-sm">
            <Link
              href="/profile"
              className="block px-4 py-2 hover:bg-gray-100"
              onClick={() => setOpen(false)}
            >
              👤 Profile
            </Link>

            <Link
              href="/profile/settings/notifications"
              className="block px-4 py-2 hover:bg-gray-100"
              onClick={() => setOpen(false)}
            >
              ⚙️ Settings
            </Link>

            <button
              onClick={logout}
              className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
