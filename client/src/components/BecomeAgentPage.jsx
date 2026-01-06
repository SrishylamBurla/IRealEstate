"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSubscribeAgentMutation } from "@/features/subscription/subscriptionApi";

export default function BecomeAgentPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [subscribeAgent, { isLoading }] = useSubscribeAgentMutation();

  useEffect(() => {
    const stored = localStorage.getItem("user");

    if (!stored) {
      router.replace("/login");
      return;
    }

    const parsed = JSON.parse(stored);

    if (parsed.role === "agent") {
      router.replace("/agent");
      return;
    }

    if (parsed.role === "admin") {
      router.replace("/admin");
      return;
    }

    setUser(parsed);
  }, [router]);

  if (!user) return null;

  const handleSubscribe = async (plan) => {
    const res = await subscribeAgent({ plan }).unwrap();

    const updatedUser = {
      ...user,
      role: "agent",
      subscription: res.subscription,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    window.dispatchEvent(new Event("auth-change"));

    router.push("/agent/properties");
  };

  return (
    <main className="h-[350px] text-white flex items-center justify-center">
      <div className="max-w-4xl bg-[#9fbedc] w-full px-6 grid md:grid-cols-2 gap-8 py-8">
        {[
          { plan: "monthly", price: "₹999 / month" },
          { plan: "yearly", price: "₹9999 / year" },
        ].map((p) => (
          <div
            key={p.plan}
            className="rounded-2xl backdrop-blur p-6 shadow-2xl border border-white/20"
          >
            <h3 className="text-2xl font-semibold capitalize">
              {p.plan} Plan
            </h3>
            <p className="text-3xl font-bold mt-3">{p.price}</p>

            <ul className="mt-4 text-sm text-gray-600 space-y-2">
              <li>✔ Unlimited listings</li>
              <li>✔ Verified leads</li>
              <li>✔ Approval notifications</li>
              <li>✔ Agent dashboard</li>
            </ul>

            <button
              onClick={() => handleSubscribe(p.plan)}
              disabled={isLoading}
              className="mt-6 w-full bg-amber-500 text-black py-2 rounded-lg font-semibold hover:bg-amber-400"
            >
              Become Agent
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
