"use client";

import AgentGuard from "@/components/AgentGuard";
import NotificationPrompt from "@/components/NotificationPrompt";
import { useEffect, useRef, useState } from "react";
import { notify } from "@/utils/notify";

import {
  useGetMyPropertiesQuery,
  // useSoftDeletePropertyMutation,
} from "@/features/properties/propertyApi";
import Link from "next/link";
import NotificationStatus from "@/components/NotificationStatus";

export default function AgentPropertiesPage() {
  const [notificationEnabled, setNotificationEnabled] = useState(false);

  const {
    data: properties = [],
    isLoading,
    isError,
  } = useGetMyPropertiesQuery();

  const prevPropertiesRef = useRef([]);

  useEffect(() => {
    if (!properties.length) return;

    if (typeof window === "undefined") return;

    const permission = localStorage.getItem("notifyPermission");
    if (permission === "granted") {
      setNotificationEnabled(true);
    }

    properties.forEach((p) => {
      const prev = prevPropertiesRef.current.find((x) => x._id === p._id);

      // APPROVED
      if (prev && !prev.isApproved && p.isApproved) {
        notify({
          title: "✅ Property Approved",
          body: `${p.title} has been approved`,
        });
      }

      // REJECTED
      if (prev && !prev.rejectionReason && p.rejectionReason) {
        notify({
          title: "❌ Property Rejected",
          body: `${p.title} was rejected`,
        });
      }

      // UNDO REJECT
      if (prev && prev.rejectionReason && !p.rejectionReason) {
        notify({
          title: "🔁 Property Back Under Review",
          body: `${p.title} is under review again`,
        });
      }
    });

    prevPropertiesRef.current = properties;
  }, [properties]);

  // const [softDeleteProperty, { isLoading: isDeleting }] =
  //   useSoftDeletePropertyMutation();

  // const handleDelete = async (id) => {
  //   const ok = confirm("Are you sure you want to delete this property?");
  //   if (!ok) return;

  //   try {
  //     await softDeleteProperty(id).unwrap();
  //   } catch (error) {
  //     alert("Failed to delete property");
  //   }
  // };

  if (isLoading) {
    return <p className="p-6">Loading properties...</p>;
  }

  if (isError) {
    return <p className="p-6 text-red-500">Failed to load properties</p>;
  }

  return (
    <AgentGuard>
      <main className="min-h-screen max-w-6xl mx-auto p-6">
        <NotificationPrompt onEnabled={() => setNotificationEnabled(true)} />

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">My Properties</h1>

          <div>
            <Link
              href="/agent/add-property"
              className="border-1 text-black px-2 py-1 rounded mr-2"
            >
              + Add Property
            </Link>
            <Link
              href="/agent/properties/trash"
              className="border border-red-500 text-red-600 px-2 py-1 rounded hover:bg-red-50"
            >
              Trash
            </Link>
          </div>
        </div>
        <NotificationStatus enabled={notificationEnabled} />

        {properties.length === 0 ? (
          <p className="text-gray-500">No properties added yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard
                key={property._id}
                property={property}
                // onDelete={handleDelete}
                // isDeleting={isDeleting}
              />
            ))}
          </div>
        )}
      </main>
    </AgentGuard>
  );
}

/* ---------------- CARD ---------------- */

function PropertyCard({ property, onDelete, isDeleting }) {
  return (
    <Link href={`/agent/properties/${property._id}`}>
      <div className="rounded-lg overflow-hidden shadow-md flex flex-col">
        <div className="h-40 bg-gray-200">
          {property.images?.[0] ? (
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}
        </div>

        <div className="p-4 space-y-1 flex-1">
          <h2 className="font-semibold text-lg">{property.title}</h2>

          <p className="text-sm text-gray-600">{property.location?.city}</p>

          <p className="font-medium text-blue-600">
            ₹{property.price.toLocaleString()}
          </p>

          <div className="flex justify-between">
            {!property.rejectionReason && (
              <StatusBadge approved={property.isApproved} />
            )}
            {/* <p className="text-xs text-gray-500">Views: {property.views}</p> */}
          </div>
          {!property.isApproved && property.rejectionReason && (
            <div className="space-y-2">
              <div className=" text-center bg-red-100 px-2 py-1 rounded">
                <p className="text-red-600 font-bold">Rejected</p>
                <p className="text-xs text-gray-600 mt-1">
                  Reason: {property.rejectionReason}
                </p>
              </div>
              <Link
                href={`/agent/properties/${property._id}/edit?resubmit=true`}
                className="block text-sm text-center bg-yellow-400 text-white px-3 py-1 rounded"
              >
                Edit & Resubmit
              </Link>
            </div>
          )}
        </div>

        {/* 
      <div className="flex border-t text-sm">
        <Link
          href={`/agent/properties/${property._id}/edit`}
          className="flex-1 text-center py-2 hover:bg-gray-100 text-blue-600"
        >
          Edit
        </Link>

        <button
          onClick={() => onDelete(property._id)}
          disabled={isDeleting}
          className="flex-1 py-2 hover:bg-gray-100 text-red-600 disabled:opacity-50"
        >
          Delete
        </button>
      </div> */}
      </div>
    </Link>
  );
}

/* ---------------- STATUS ---------------- */

function StatusBadge({ approved }) {
  return approved ? (
    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
      Approved
    </span>
  ) : (
    <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">
      Pending Approval
    </span>
  );
}
