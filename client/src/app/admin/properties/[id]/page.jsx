"use client";

import { useParams, useRouter } from "next/navigation";
import AdminGuard from "@/components/AdminGuard";
import AdminPropertyHistory from "@/components/AdminPropertyHistory";
import { useGetPropertyByIdQuery } from "@/features/properties/propertyApi";
import {
  useApprovePropertyMutation,
  useRejectPropertyMutation,
  useUndoRejectPropertyMutation,
} from "@/features/admin/adminPropertyApi";

export default function AdminPropertyDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data: property, isLoading, isError } = useGetPropertyByIdQuery(id);

  const [approveProperty] = useApprovePropertyMutation();
  const [rejectProperty] = useRejectPropertyMutation();
  const [undoRejectProperty, { isLoading: undoing }] =
    useUndoRejectPropertyMutation();

  if (isLoading) return <p className="p-6">Loading property...</p>;
  if (isError || !property)
    return <p className="p-6 text-red-500">Property not found</p>;

  const isRejected = Boolean(property.rejectionReason);
  const isApproved = property.isApproved;
  const isPending = !isApproved && !isRejected;

  const handleApprove = async () => {
    await approveProperty(property._id).unwrap();
  };

  const handleReject = async () => {
    const reason = prompt("Enter rejection reason (required):");
    if (!reason) return;

    await rejectProperty({ id: property._id, reason }).unwrap();
  };

  const handleUndoReject = async () => {
    if (!property.rejectionReason) return;

    await undoRejectProperty(property._id).unwrap();
  };

  return (
    <AdminGuard>
      <main className="max-w-5xl mx-auto p-6 space-y-6">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{property.title}</h1>

          <button
            onClick={() => router.back()}
            className="border px-4 py-1 rounded"
          >
            ← Back
          </button>
        </div>

        {/* IMAGE */}
        <img
          src={property.images?.[0]}
          className="w-full h-80 object-cover rounded"
        />

        {/* BASIC INFO */}
        <div className="grid grid-cols-2 gap-4">
          <p>
            <strong>City:</strong> {property.location?.city}
          </p>
          <p>
            <strong>Price:</strong> ₹{property.price}
          </p>
          <p>
            <strong>Purpose:</strong> {property.purpose}
          </p>
          <p>
            <strong>Type:</strong> {property.type}
          </p>
          <p>
            <strong>Bedrooms:</strong> {property.bedrooms}
          </p>
          <p>
            <strong>Bathrooms:</strong> {property.bathrooms}
          </p>
        </div>

        {/* DESCRIPTION */}
        <div>
          <h2 className="font-semibold text-lg mb-2">Description</h2>
          <p className="text-gray-700">{property.description}</p>
        </div>

        {/* STATUS + ACTIONS */}
        <div className="border rounded p-4 space-y-3">
          {isPending && (
            <div className="flex gap-4">
              <button
                onClick={handleApprove}
                className="bg-green-600 text-white px-6 py-2 rounded"
              >
                Approve
              </button>

              <button
                onClick={handleReject}
                className="bg-red-600 text-white px-6 py-2 rounded"
              >
                Reject
              </button>
            </div>
          )}

          {isApproved && (
            <p className="text-green-600 font-semibold">✅ Approved</p>
          )}

          {isRejected && (
            <div className="space-y-2">
              <p className="text-red-600 font-semibold">❌ Rejected</p>

              <p className="text-sm text-gray-600">
                Reason: {property.rejectionReason}
              </p>
              <button
                onClick={handleUndoReject}
                disabled={undoing}
                className="bg-yellow-500 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {undoing ? "Undoing..." : "Undo Reject"}
              </button>
            </div>
          )}
        </div>

        {/* 🔍 APPROVAL HISTORY (PERFECT PLACE) */}
        <AdminPropertyHistory propertyId={property._id} />
      </main>
    </AdminGuard>
  );
}
