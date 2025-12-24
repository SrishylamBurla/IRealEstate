"use client";

import AgentGuard from "@/components/AgentGuard";
import {
  useGetMyDeletedPropertiesQuery,
  useRestorePropertyMutation,
} from "@/features/properties/propertyApi";
import Link from "next/link";

export default function TrashPage() {
  const { data: properties = [], isLoading } = useGetMyDeletedPropertiesQuery();

  const [restoreProperty, { isLoading: restoring }] =
    useRestorePropertyMutation();

  const handleRestore = async (id) => {
    await restoreProperty(id).unwrap();
  };

  if (isLoading) {
    return <p className="p-6">Loading trash...</p>;
  }

  return (
    <AgentGuard>
      <main className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Trash</h1>

          <Link href="/agent/properties" className="text-sm text-blue-600">
            ← Back to My Properties
          </Link>
        </div>

        {properties.length === 0 ? (
          <p className="text-gray-500">No deleted properties.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((p) => (
              <div key={p._id} className="shadow-md rounded-lg overflow-hidden">
                <div className="h-36 bg-gray-200">
                  {p.images?.[0] && (
                    <Link href={`/agent/properties/${p._id}`}>
                      <img
                        src={p.images[0]}
                        className="w-full h-full object-cover"
                      />
                    </Link>
                  )}
                </div>

                <div className="p-4 space-y-2">
                  <h2 className="font-semibold">{p.title}</h2>

                  <p className="text-sm text-gray-500">
                    Deleted on {new Date(p.deletedAt).toLocaleDateString()}
                  </p>

                  <button
                    onClick={() => handleRestore(p._id)}
                    disabled={restoring}
                    className="w-full bg-green-600 text-white py-2 rounded cursor-pointer"
                  >
                    Restore
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </AgentGuard>
  );
}
