"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NotificationBell from "./NotificationBell";
import { getDefaultAvatar } from "@/utils/getDefaultAvatar";
import AvatarSkeleton from "./ui/AvatarSkeleton";
import ProfileMenu from "./ProfileMenu";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const loadUser = () => {
    setLoadingUser(true);
    const storedUser = localStorage.getItem("user");
    // console.log("🔁 Navbar reload user", storedUser);
    setUser(storedUser ? JSON.parse(storedUser) : null);
    setLoadingUser(false);
  };

  useEffect(() => {
    loadUser();
    window.addEventListener("auth-change", loadUser);
    return () => window.removeEventListener("auth-change", loadUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("auth-change"));
    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-[#1b3529] via-slate-900 to-[#123644] shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* 🏠 BRAND */}
        <Link href="/" className="text-xl font-bold tracking-wide text-white">
          iRealEstate
        </Link>

        {/* 🔗 NAV LINKS */}
        <div className="hidden md:flex items-center gap-6 text-sm text-gray-200">
          <Link href="/" className="hover:text-white transition">
            Home
          </Link>

          <Link href="/properties" className="hover:text-white transition">
            Properties
          </Link>

          {/* AGENT LINKS */}
          {user?.role === "agent" && (
            <>
              <Link
                href="/agent/properties"
                className="hover:text-white transition"
              >
                My Listings
              </Link>

              <Link
                href="/agent/add-property"
                className="hover:text-white transition"
              >
                Add Property
              </Link>

              <Link
                href="/agent/inquiries"
                className="hover:text-white transition"
              >
                Leads
              </Link>
            </>
          )}

          {/* USER */}
          {user?.role === "user" && (
            <Link
              href="/user/my-inquiries"
              className="hover:text-white transition"
            >
              My Inquiries
            </Link>
          )}

          {/* ADMIN */}
          {user?.role === "admin" && (
            <>
              <Link href="/admin" className="hover:text-white transition">
                Dashboard
              </Link>

              <Link
                href="/admin/properties/pending"
                className="hover:text-white transition"
              >
                Approvals
              </Link>

              <Link href="/admin/trash" className="hover:text-white transition">
                Trash
              </Link>
            </>
          )}
        </div>

        {/* 👤 RIGHT ACTIONS */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          {user && <NotificationBell />}

          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden text-white text-xl"
          >
            ☰
          </button>

          {/* Profile */}
          {user && <ProfileMenu user={user} />}

          {/* {user && (
            <Link
              href="/profile"
              className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-sm text-white hover:bg-white/20 transition"
            >
              {loadingUser ? (
                <AvatarSkeleton size={28} />
              ) : (
                <img
                  src={user.avatar || getDefaultAvatar(user.role)}
                  key={user.avatar}
                  alt="avatar"
                  className="h-7 w-7 rounded-full object-cover"
                />
              )}

              {user.name.split(" ")[0]}
              {/* {user.name?.charAt(0).toUpperCase() + user.name?.slice(1)} */}
          {/* </Link>
          )} */}

          {/* Auth */}
          {user?.role === "user" && (
            <Link
              href="/subscribe/agent"
              className="text-amber-400 font-medium hover:text-amber-300 transition"
            >
              Become Agent
            </Link>
          )}

          {!user && (
            <Link
              href="/login"
              className="bg-amber-500 text-black px-4 py-1.5 rounded-full text-sm font-medium hover:bg-amber-400 transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 md:hidden">
          <div className="absolute right-0 top-0 h-full w-72 bg-[rgba(0,0,0,0.3)] backdrop-blur-md p-6 text-white">
            <button
              onClick={() => setMobileOpen(false)}
              className="mb-6 text-xl"
            >
              ✕
            </button>

            <nav className="flex flex-col gap-4 text-sm">
              <Link href="/" onClick={() => setMobileOpen(false)}>
                Home
              </Link>
              <Link href="/properties" onClick={() => setMobileOpen(false)}>
                Properties
              </Link>

              {user?.role === "agent" && (
                <>
                  <Link href="/agent/properties">My Listings</Link>
                  <Link href="/agent/add-property">Add Property</Link>
                  <Link href="/agent/inquiries">Leads</Link>
                </>
              )}

              {user?.role === "admin" && (
                <>
                  <Link href="/admin">Dashboard</Link>
                  <Link href="/admin/trash">Trash</Link>
                </>
              )}

              {user && <Link href="/profile">Profile</Link>}

              {user && (
                <button
                  onClick={handleLogout}
                  className="mt-6 text-red-400 text-left"
                >
                  Logout
                </button>
              )}
            </nav>
          </div>
        </div>
      )}
    </nav>
  );
}
