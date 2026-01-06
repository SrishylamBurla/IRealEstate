"use client";

import { useEffect, useState } from "react";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import BecomeAgentPage from "@/components/BecomeAgentPage";

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    setUser(stored ? JSON.parse(stored) : null);
    setHydrated(true);
  }, []);

  return (
    <main className="w-full text-gray-800 scroll-smooth">
      {/* ================= HERO ================= */}
      <section className="relative min-h-[90vh] bg-gradient-to-br from-[#1b3529] via-slate-900 to-[#123644] text-white flex items-center">
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Find Your <span className="">Perfect Home</span>
            </h1>

            <p className="mt-6 text-lg text-gray-300 max-w-xl">
              Buy, rent, and explore verified properties from trusted agents.
              Smart approvals, instant notifications, and secure deals — all in
              one place.
            </p>

            {/* CTA */}
            <div className="mt-8 flex gap-4 flex-wrap">
              <a
                href="/properties"
                className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-amber-400 transition"
              >
                Browse Properties
              </a>

              {hydrated && !user && (
                <a
                  href="/register"
                  className="border border-white/40 px-6 py-3 rounded-lg hover:bg-white/10 transition"
                >
                  Become an Agent
                </a>
              )}

              {hydrated && user?.role === "user" && (
                <a
                  href="/subscribe/agent"
                  className="border border-white/40 px-6 py-3 rounded-lg hover:bg-white/10 transition"
                >
                  Become an Agent
                </a>
              )}

              {hydrated && user?.role === "agent" && (
                <a
                  href="/agent/add-property"
                  className="border border-white/40 px-6 py-3 rounded-lg hover:bg-white/10 transition"
                >
                  Add New Property
                </a>
              )}

              {hydrated && user?.role === "admin" && (
                <a
                  href="/admin"
                  className="border border-white/40 px-6 py-3 rounded-lg hover:bg-white/10 transition"
                >
                  Admin Dashboard
                </a>
              )}
            </div>
          </div>

          {/* Hero Info Card */}
          <div className="hidden md:block">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
              <p className="text-sm text-gray-300 mb-2">
                Trusted by agents & buyers
              </p>
              <h3 className="text-2xl font-semibold">
                Verified Real Estate Platform
              </h3>
              <p className="text-gray-300 mt-3 text-sm">
                Admin-approved listings • Secure authentication • Real-time
                notifications
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CATEGORIES ================= */}
      <section className="py-20 bg-[#DDF4E7]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Explore Property Categories
          </h2>
          <p className="text-gray-600 mb-12">
            Choose from a wide range of verified property types
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              "Apartments",
              "Independent Houses",
              "Villas",
              "Commercial Spaces",
            ].map((item) => (
              <div
                key={item}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition"
              >
                <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  🏠
                </div>
                <h3 className="font-semibold">{item}</h3>
                <p className="text-sm text-gray-500 mt-2">
                  Verified listings with real images & details
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURED ================= */}
      <FeaturedProperties />

      {/* ================= STATS ================= */}
      <section className="py-14 bg-gradient-to-r from-[#1b3529] to-[#123644]">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-6 text-center">
          {[
            { label: "Verified Properties", value: "100%" },
            { label: "Active Agents", value: "500+" },
            { label: "Cities Covered", value: "25+" },
            { label: "Successful Deals", value: "10K+" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-yellow-300">{s.value}</p>
              <p className="text-sm text-gray-300 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= WHY US ================= */}
      <section className="py-20 bg-[#DDF4E7]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose iRealEstate?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Admin Verified Listings",
                desc: "Every property is reviewed and approved for authenticity.",
              },
              {
                title: "Instant Notifications",
                desc: "Get email, in-app & push notifications in real-time.",
              },
              {
                title: "Secure Authentication",
                desc: "Password, OTP, email & mobile-based login support.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition"
              >
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= AGENT SUBSCRIPTION ================= */}
      {hydrated && user?.role === "user" && (
        <section className="py-24 bg-[#006A67] text-white">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-4">
              Upgrade to Agent Account
            </h2>
            <p className="text-gray-300 mb-10 max-w-2xl mx-auto">
              List properties, receive verified leads, and manage everything
              from one powerful dashboard.
            </p>
            {hydrated && !user && (
              <a href="/register" className="inline-block border px-6 py-2 mt-6 rounded hover:bg-amber-500 hover:text-black transition">
                Become an Agent
              </a>
            )}

            {hydrated && user?.role === "user" && (
              <a href="/subscribe/agent" className="inline-block border px-6 py-2 mt-6 rounded hover:bg-amber-500 hover:text-black transition">
                Become an Agent
              </a>
            )}
          </div>
        </section>
      )}

      {/* ================= FOOTER CTA ================= */}
      <section className="py-16 bg-slate-900 text-white text-center">
        <h3 className="text-2xl font-semibold mb-3">
          Start Your Property Journey Today
        </h3>
        <p className="mb-6 text-gray-300">
          Discover trusted properties with modern tools & secure workflows.
        </p>
        <a
          href="/properties"
          className="inline-block border px-6 py-2 rounded hover:bg-amber-500 hover:text-black transition"
        >
          Explore Properties
        </a>
      </section>
    </main>
  );
}


// import Header from "@/components/frontend-m/Header";
// import SearchBar from "@/components/frontend-m/SearchBar";
// import Categories from "@/components/frontend-m/Categories";
// import BottomNav from "@/components/frontend-m/BottomNav";

// export default function HomePage() {
//   return (
//     <>
//       <Header />
//       <main className="px-6 pt-6 flex flex-col gap-8">
//         <SearchBar />
//         <Categories />
//         {/* RecommendedCarousel */}
//         {/* TrendingProjects */}
//       </main>
//       <BottomNav />
//     </>
//   );
// }
