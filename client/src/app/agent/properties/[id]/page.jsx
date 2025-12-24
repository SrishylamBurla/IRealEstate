"use client";

import AgentGuard from "@/components/AgentGuard";
import PropertyApprovalHistory from "@/components/PropertyApprovalHistory";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";

import {
  useGetPropertyByIdQuery,
  useSoftDeletePropertyMutation,
} from "@/features/properties/propertyApi";

export default function AgentPropertyDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: property, isLoading, isError } = useGetPropertyByIdQuery(id);
  const [softDeleteProperty, { isLoading: isDeleting }] =
    useSoftDeletePropertyMutation();

  const handleDelete = async () => {
    

    try {
      await softDeleteProperty(property._id).unwrap();
      // alert("Property deleted successfully");
      router.push("/agent/properties");
    } catch (err) {
      alert("Failed to delete property");
    } finally {
      setShowDeleteModal(false);
    }
  };

  if (isLoading) {
    return <p className="p-6">Loading property...</p>;
  }

  if (isError || !property) {
    return <p className="p-6 text-red-500">Property not found</p>;
  }

  const isRejected = !!property.rejectionReason;
  const isApproved = property.isApproved;

  return (
    <AgentGuard>
      <main className="max-w-6xl mx-auto p-6 space-y-6">
        {/* 🔙 Back */}
        <button
          onClick={() => router.back()}
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back to My Properties
        </button>

        {/* 🏠 Header */}
        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-bold">{property.title}</h1>

          {!isRejected && <StatusBadge approved={isApproved} />}
        </div>

        {/* 🖼 Images */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {property.images?.length ? (
            property.images.map((img) => (
              <img
                key={img}
                src={img}
                className="h-48 w-full object-cover rounded"
                alt="Property"
              />
            ))
          ) : (
            <div className="col-span-full text-gray-500">
              No images uploaded
            </div>
          )}
        </div>

        {/* 💰 Basic Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <Info label="Price" value={`₹${property.price.toLocaleString()}`} />
          <Info label="Purpose" value={property.purpose} />
          <Info label="Type" value={property.type} />
          <Info label="City" value={property.location?.city} />
          <Info label="Bedrooms" value={property.bedrooms || "-"} />
          <Info label="Bathrooms" value={property.bathrooms || "-"} />
          <Info
            label="Area"
            value={property.area ? `${property.area} sqft` : "-"}
          />
        </div>

        {/* 📝 Description */}
        <section>
          <h2 className="font-semibold mb-1">Description</h2>
          <p className="text-gray-700">{property.description}</p>
        </section>

        {/* 🧩 Amenities */}
        {property.amenities?.length > 0 && (
          <section>
            <h2 className="font-semibold mb-2">Amenities</h2>
            <div className="flex flex-wrap gap-2">
              {property.amenities.map((a) => (
                <span key={a} className="bg-gray-100 px-2 py-1 rounded text-xs">
                  {a}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* ❌ Rejection Info */}
        {isRejected && (
          <div className="bg-red-100 border border-red-300 p-4 rounded">
            <p className="font-semibold text-red-700">Rejected</p>
            <p className="text-sm text-gray-700 mt-1">
              Reason: {property.rejectionReason}
            </p>

            <Link
              href={`/agent/properties/${property._id}/edit?resubmit=true`}
              className="inline-block mt-3 bg-yellow-500 text-white px-4 py-2 rounded text-sm"
            >
              Edit & Resubmit
            </Link>
          </div>
        )}

        {/* ⚙ Actions */}
        <div className="flex gap-4 pt-6 border-t">
          <Link
            href={`/agent/properties/${property._id}/edit`}
            className="bg-blue-600 text-white px-6 py-2 rounded"
          >
            Edit Property
          </Link>

          <button
            onClick={() => {
              setShowDeleteModal(true);
            }}
            disabled={isDeleting}
            className="border px-6 py-2 rounded text-red-600 disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
        <PropertyApprovalHistory propertyId={property._id} />
        <ConfirmDeleteModal
          open={showDeleteModal}
          loading={isDeleting}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
        />
      </main>
    </AgentGuard>
  );
}

/* ---------------- UI HELPERS ---------------- */

function Info({ label, value }) {
  return (
    <div className="border rounded p-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

function StatusBadge({ approved }) {
  return approved ? (
    <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm">
      Approved
    </span>
  ) : (
    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded text-sm">
      Pending Approval
    </span>
  );
}
