"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UserGuard({ children }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user) {
      router.replace("/login");
      return;
    }

    setAllowed(true);
  }, [router]);

  if (!allowed) return null;

  return children;
}
