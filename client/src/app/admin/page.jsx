"use client";

import AdminEmailLogsPage from "@/components/AdminEmaillogsPage";
import AdminGuard from "@/components/AdminGuard";
import {
  useGetAllUsersQuery,
  useGetAllPropertiesQuery,
  useGetAllInquiriesQuery,
} from "@/features/admin/adminApi";

export default function AdminDashboardPage() {
  const { data: users = [] } = useGetAllUsersQuery();
  const { data: properties = [] } = useGetAllPropertiesQuery();
  const { data: inquiries = [] } = useGetAllInquiriesQuery();

  return (
    <AdminGuard>
      <main className="min-h-screen max-w-6xl mx-auto p-6 space-y-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Stat title="Users" value={users.length} />
          <Stat title="Properties" value={properties.length} />
          <Stat title="Inquiries" value={inquiries.length} />
          {/* <Stat title="Pending Properties" value={pendingCount} highlight /> */}

        </div>
        <AdminEmailLogsPage />
      </main>
    </AdminGuard>
  );
}

function Stat({ title, value }) {
  return (
    <div className="shadow-[0px_4px_6px_0px_rgba(147,_51,_234,_0.15)] bg-amber-100 rounded-lg p-4 text-center">
      <p className="text-sm text-gray-800">{title}</p>
      <p className="text-2xl font-bold text-gray-700">{value}</p>
    </div>
  );
}
