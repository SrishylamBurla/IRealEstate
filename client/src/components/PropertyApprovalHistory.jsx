"use client";

import { useGetPropertyApprovalHistoryQuery } from "@/features/admin/adminPropertyApi";

export default function PropertyApprovalHistory({ propertyId }) {
  const {
    data: logs = [],
    isLoading,
    isError,
  } = useGetPropertyApprovalHistoryQuery(propertyId, {
    skip: !propertyId,
  });

  if (isLoading) {
    return <p className="text-sm text-gray-500">Loading approval history…</p>;
  }

  if (isError) {
    return (
      <p className="text-sm text-red-500">
        Failed to load approval history
      </p>
    );
  }

  if (logs.length === 0) {
    return (
      <p className="text-sm text-gray-500 mt-4">
        No approval history yet
      </p>
    );
  }

  return (
    <section className="mt-8 border-t pt-4">
      <h3 className="font-semibold mb-3">Approval History</h3>

      <ul className="space-y-3">
        {logs.map((log) => (
          <li
            key={log._id}
            className="border rounded p-3 text-sm bg-gray-50"
          >
            <p className="font-medium capitalize">
              {formatAction(log.action)}
            </p>

            <p className="text-gray-600">
              By: {log.admin?.name || "Admin"}
            </p>

            {log.reason && (
              <p className="text-red-600 mt-1">
                Reason: {log.reason}
              </p>
            )}

            <p className="text-xs text-gray-500 mt-1">
              {new Date(log.createdAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ---------------- HELPERS ---------------- */

function formatAction(action) {
  switch (action) {
    case "approved":
      return "Approved";
    case "rejected":
      return "Rejected";
    case "undo_reject":
      return "Reopened for Review";
    case "resubmitted":
      return "Resubmitted by Agent";
    default:
      return action;
  }
}
