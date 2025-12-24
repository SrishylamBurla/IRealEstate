"use client";

import AdminGuard from "@/components/AdminGuard";
// import AdminPropertyHistory from "@/components/AdminPropertyHistory";
import {
  useApprovePropertyMutation,
  useGetPendingPropertiesQuery,
  useRejectPropertyMutation,
  useUndoRejectPropertyMutation,
} from "@/features/admin/adminPropertyApi";
import Link from "next/link";

export default function AdminPropertiesPage() {
  const {
    data: properties = [],
    isLoading,
    isError,
  } = useGetPendingPropertiesQuery();

  const [approveProperty, { isLoading: isApproving }] =
    useApprovePropertyMutation();

  const [rejectProperty] = useRejectPropertyMutation();
  const [undoRejectProperty] = useUndoRejectPropertyMutation();

  const handleApprove = async (id) => {
    await approveProperty(id).unwrap();
  };

  const handleReject = async (id) => {
    const reason = prompt("Enter rejection reason (required):");

    if (!reason) return;

    await rejectProperty({ id, reason }).unwrap();
  };

  if (isLoading) return <p className="p-6">Loading...</p>;
  if (isError) return <p className="p-6 text-red-500">Failed to load</p>;

  return (
    <AdminGuard>
      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Pending Properties</h1>

        {properties.length === 0 ? (
          <p className="text-gray-500">No pending approvals</p>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {properties.map((p) => {
              const isRejected = !!p.rejectionReason;
              const isApproved = p.isApproved;
              const isPending = !isApproved && !isRejected;

              return (
                <div
                  key={p._id}
                  className="shadow-md hover:shadow-lg rounded overflow-hidden"
                >
                  {/* <Link href={`/properties/${p._id}`} key={p._id}> */}
                    <img
                      src={p.images?.[0]}
                      className="h-40 w-full object-cover"
                    />
                  {/* </Link> */}
                  <div className="p-4 space-y-1">
                    <h2 className="font-semibold">{p.title}</h2>
                    <p className="text-sm text-gray-600">{p.location?.city}</p>

                    <p className="text-sm">Agent: {p.agent?.name}</p>

                    <Link href={`/admin/properties/${p._id}`}>
                      <button className="w-full border text-black px-2 py-1 rounded mt-2">
                        View Details
                      </button>
                    </Link>
                    

                    
                    {/* <AdminPropertyHistory propertyId={p._id} /> */}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </AdminGuard>
  );
}
