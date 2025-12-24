"use client";

import AdminGuard from "@/components/AdminGuard";
import {
  useGetEmailLogsQuery,
  useResendEmailMutation,
} from "@/features/admin/adminEmailApi";

export default function AdminEmailLogsPage() {
  const { data: logs = [], isLoading } = useGetEmailLogsQuery();
  const [resendEmail] = useResendEmailMutation();

  if (isLoading) return <p>Loading email logs...</p>;

  return (
    <AdminGuard>
      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Email Logs</h1>

        <div className="space-y-4">
          {logs.map((log) => (
            <div
              key={log._id}
              className="shadow-md rounded p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{log.subject}</p>
                <p className="text-sm text-gray-600">
                  To: {log.to}
                </p>
                <p className="text-xs">
                  Status:{" "}
                  <span
                    className={
                      log.status === "failed"
                        ? "text-red-600"
                        : "text-green-600"
                    }
                  >
                    {log.status}
                  </span>
                </p>
              </div>

              <button
                onClick={() => resendEmail(log._id)}
                className="bg-gray-800 text-white hover:bg-black px-4 py-2 rounded"
              >
                Resend
              </button>
            </div>
          ))}
        </div>
      </main>
    </AdminGuard>
  );
}
