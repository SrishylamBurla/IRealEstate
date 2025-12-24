"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AgentGuard({ children }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    // ❌ Not logged in
    if (!token || !user) {
      router.replace("/login");
      return;
    }

    // ❌ Logged in but not agent
    if (user.role !== "agent") {
      router.replace("/properties");
      return;
    }

    // ✅ Agent confirmed
    setAllowed(true);
  }, [router]);

  if (!allowed) return null; // ⛔ BLOCK RENDER

  return children;
}
