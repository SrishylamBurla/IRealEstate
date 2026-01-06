"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import BecomeAgentPage from "@/components/BecomeAgentPage";

export default function AgentSubscriptionPage() {
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) router.replace("/register");
    else if (user.role !== "user") router.replace("/");
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-[#1b3529] via-slate-900 to-[#123644]">
      <BecomeAgentPage />
    </main>
  );
}
