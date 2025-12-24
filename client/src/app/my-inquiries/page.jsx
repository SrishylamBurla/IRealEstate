"use client";

import UserGuard from "@/components/UserGuard";
import { useGetMyRequestsQuery } from "@/features/inquiries/inquiryApi";

function MyInquiriesContent() {
  const { data: inquiries = [], isLoading, isError } =
    useGetMyRequestsQuery();

  if (isLoading) {
    return <p>Loading your inquiries...</p>;
  }

  if (isError) {
    return <p className="text-red-500">Failed to load inquiries</p>;
  }

  if (inquiries.length === 0) {
    return <p className="text-gray-500">You haven’t sent any inquiries yet.</p>;
  }

  return (
    <div className="space-y-4">
      {inquiries.map((inq) => (
        <div
          key={inq._id}
          className="border rounded-lg p-4 flex flex-col gap-2"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">
              {inq.property?.title}
            </h2>

            {/* ✅ STATUS BADGE */}
            <StatusBadge status={inq.status} />
          </div>

          <p className="text-sm text-gray-600">
            {inq.property?.location?.city}
          </p>

          <p className="text-sm">
            <span className="font-medium">Your message:</span>{" "}
            {inq.message}
          </p>

          <p className="text-xs text-gray-500">
            Sent on {new Date(inq.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function MyInquiriesPage() {
  return (
    <UserGuard>
      <main className="min-h-screen max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">My Inquiries</h1>
        <MyInquiriesContent />
      </main>
    </UserGuard>
  );
}

/* ---------------- STATUS BADGE ---------------- */

function StatusBadge({ status }) {
  const styles = {
    new: "bg-blue-100 text-blue-700",
    contacted: "bg-yellow-100 text-yellow-700",
    closed: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`px-2 py-1 rounded text-xs font-medium ${
        styles[status]
      }`}
    >
      {status?.toUpperCase()}
    </span>
  );
}
