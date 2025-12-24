"use client";

import { useGetPropertyApprovalHistoryQuery } from "@/features/admin/adminPropertyApi";
import { useEffect } from "react";

export default function PropertyApprovalHistory({ propertyId }) {
  const { data: logs = [], isLoading, isFetching } =
    useGetPropertyApprovalHistoryQuery(propertyId);

  if (isLoading && isFetching) return <p>Loading history...</p>;

  if (logs.length === 0) {
    return <p className="text-gray-500 text-center mt-6">No history found</p>;
  }

  return (
    <div className="mt-6 border-t pt-4">
      <h3 className="font-semibold mb-3">Approval History</h3>

      <ul className="space-y-2">
        {logs.map((log) => (
          <li
            key={log._id}
            className="text-sm border rounded p-2"
          >
            <p>
              <span className="font-medium">
                {log.action.replace("_", " ")}
              </span>{" "}
              by {log.admin?.name}
            </p>

            {log.reason && (
              <p className="text-red-600">
                Reason: {log.reason}
              </p>
            )}

            <p className="text-xs text-gray-500">
              {new Date(log.createdAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
