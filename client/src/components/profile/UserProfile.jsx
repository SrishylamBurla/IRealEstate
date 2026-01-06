"use client";

import AvatarUploader from "./AvatarUploader";

export default function UserProfile({ user }) {

  
  return (
    <div className="space-y-10">
      {/* 🟦 PROFILE HEADER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-800 via-slate-900 to-indigo-900 p-8 text-white shadow-xl">
        {/* subtle overlay */}
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative flex items-center gap-6">
          {/* Avatar */}
          <AvatarUploader
            user={user}
            onUpdated={(avatar) => {
              const updated = { ...user, avatar };
              localStorage.setItem("user", JSON.stringify(updated));
              window.dispatchEvent(new Event("auth-change"));
            }}
          />

          {/* User Info */}
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">
              {user.name}
            </h2>
            <p className="mt-1 text-sm text-indigo-200 capitalize">
              {user.role} Account
            </p>
          </div>
        </div>
      </div>

      {/* 🧾 DETAILS CARD */}
      <div className="rounded-2xl bg-white p-8 shadow-lg space-y-10">
        {/* ACCOUNT INFO */}
        <Section title="Account Information">
          <Info label="Full Name" value={user.name} />
          <Info label="Email Address" value={user.email} />
          <Info label="Account Type" value={user.role} />
        </Section>

        {/* ACTIVITY */}
        <Section title="Activity Overview">
          <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
            Manage your activity, track inquiries, and stay updated with
            property-related notifications and approvals.
          </p>
        </Section>
      </div>

      {user.role === "user" && (
  <div className="mt-6 p-4 border rounded-xl bg-amber-50">
    <h4 className="font-semibold text-gray-800">
      Become a Real Estate Agent
    </h4>
    <p className="text-sm text-gray-600 mt-1">
      List properties, receive leads, and manage approvals.
    </p>

    <a
      href="/subscribe/agent"
      className="inline-block mt-3 bg-amber-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-amber-400"
    >
      Upgrade to Agent
    </a>
  </div>
)}

    </div>
  );
}

/* ---------------- UI HELPERS ---------------- */

function Section({ title, children }) {
  return (
    <section>
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500">
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Info({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-2 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-800 capitalize">
        {value}
      </span>
    </div>
  );
}

