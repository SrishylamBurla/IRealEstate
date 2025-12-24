"use client";

import AgentGuard from "@/components/AgentGuard";
import {
  useGetMyInquiriesQuery,
  useUpdateInquiryStatusMutation,
} from "@/features/inquiries/inquiryApi";

/**
 * 🔒 This component runs ONLY after AgentGuard allows access
 */
function AgentInquiriesContent() {
  const { data: inquiries = [], isLoading, isError } =
    useGetMyInquiriesQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <p>Loading inquiries...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-red-500">Failed to load inquiries</p>
      </div>
    );
  }

  if (inquiries.length === 0) {
    return <p className="text-gray-500">No inquiries yet.</p>;
  }

  return (
    <div className="space-y-4">
      {inquiries.map((inq) => (
        <div
          key={inq._id}
          className="border rounded-lg p-4 flex flex-col sm:flex-row sm:justify-between gap-4"
        >
          {/* LEFT */}
          <div>
            <h2 className="font-semibold">{inq.name}</h2>
            <p className="text-sm text-gray-600">{inq.phone}</p>
            <p className="text-sm mt-1">{inq.message}</p>

            <div className="mt-2 flex items-center gap-3">
              <StatusBadge status={inq.status} />
              <StatusDropdown inquiry={inq} />
            </div>
          </div>

          {/* RIGHT */}
          <div className="text-sm text-gray-600">
            <p>
              <span className="font-medium">Property:</span>{" "}
              {inq.property?.title}
            </p>
            <p>
              <span className="font-medium">City:</span>{" "}
              {inq.property?.location?.city}
            </p>
            <p>
              <span className="font-medium">Date:</span>{" "}
              {new Date(inq.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AgentInquiriesPage() {
  return (
    <AgentGuard>
      <main className="min-h-screen max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">My Inquiries</h1>
        <AgentInquiriesContent />
      </main>
    </AgentGuard>
  );
}

/* ---------------- STATUS COMPONENTS ---------------- */

function StatusDropdown({ inquiry }) {
  const [updateStatus, { isLoading }] =
    useUpdateInquiryStatusMutation();

  const handleChange = async (e) => {
    await updateStatus({
      id: inquiry._id,
      status: e.target.value,
    });
  };

  return (
    <select
      value={inquiry.status}
      onChange={handleChange}
      disabled={isLoading}
      className="border rounded px-2 py-1 text-sm"
    >
      <option value="new">New</option>
      <option value="contacted">Contacted</option>
      <option value="closed">Closed</option>
    </select>
  );
}

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
      {status.toUpperCase()}
    </span>
  );
}
