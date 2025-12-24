"use client";

import AdminGuard from "@/components/AdminGuard";
import {
  useGetAdminTrashQuery,
  usePermanentDeletePropertyMutation,
  useRestorePropertyMutation,
} from "@/features/properties/propertyApi";

export default function AdminTrashPage() {
  const { data: properties = [], isLoading } = useGetAdminTrashQuery();
  const [restoreProperty] = useRestorePropertyMutation();
  const [permanentDelete] = usePermanentDeletePropertyMutation();

  if (isLoading) return <p className="p-6">Loading trash...</p>;

  return (
    <AdminGuard>
      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">🗑️ Trash (Deleted Properties)</h1>

        {properties.length === 0 ? (
          <p className="text-gray-500">Trash is empty</p>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {properties.map((p) => (
              <div
                key={p._id}
                className="border rounded shadow-sm overflow-hidden"
              >
                <img
                  src={p.images?.[0]}
                  className="h-36 w-full object-cover"
                />

                <div className="p-4 space-y-1">
                  <h2 className="font-semibold">{p.title}</h2>
                  <p className="text-sm text-gray-600">
                    Agent: {p.agent?.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Deleted on: {new Date(p.deletedAt).toLocaleString()}
                  </p>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => restoreProperty(p._id)}
                      className="flex-1 bg-green-600 text-white py-1 rounded text-sm"
                    >
                      Restore
                    </button>

                    <button
                      onClick={() => {
                        if (
                          confirm(
                            "This will permanently delete the property. Continue?"
                          )
                        ) {
                          permanentDelete(p._id);
                        }
                      }}
                      className="flex-1 bg-red-700 text-white py-1 rounded text-sm"
                    >
                      Delete Forever
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </AdminGuard>
  );
}
