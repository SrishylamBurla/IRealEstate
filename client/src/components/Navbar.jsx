"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  const loadUser = () => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  };

  useEffect(() => {
    loadUser();

    window.addEventListener("auth-change", loadUser);

    return () => {
      window.removeEventListener("auth-change", loadUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // ✅ NOTIFY NAVBAR
    window.dispatchEvent(new Event("auth-change"));

    router.push("/login");
  };

  return (
    <nav className="w-full shadow-md">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          iRealEstate
        </Link>

        <div className="flex gap-6 items-center">
          <Link href="/">Home</Link>
          <Link href="/properties">All Properties</Link>

          {user?.role === "agent" && (
            <>
              <Link href="/agent/properties">My Properties</Link>
              <Link href="/agent/add-property">Add Property</Link>
              <Link href="/agent/inquiries">Leads</Link>
            </>
          )}

          {user?.role === "user" && (
            <Link href="/my-inquiries">My Inquiries</Link>
          )}
          
          {user?.role === "admin" && (
            <Link href="/admin/properties/pending">Pending Properties</Link>
          )}

          {user?.role === "admin" && <Link href="/admin">Admin</Link>}

          {user?.role === "admin" && <Link href="/admin/trash">Trash</Link>}

          


          {!user ? (
            <Link href="/login">Login</Link>
          ) : (
            <button
              onClick={handleLogout}
              className="text-red-600 hover:underline"
            >
              Logout
            </button>
          )}
          {user?.role === "agent" && <NotificationBell />}
        </div>
      </div>
    </nav>
  );
}
