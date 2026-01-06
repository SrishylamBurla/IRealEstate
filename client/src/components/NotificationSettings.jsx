// "use client";

// import { useUpdateNotificationPreferencesMutation } from "@/features/users/userApi";
// import { useState } from "react";

// export default function NotificationSettings() {
//   const [updatePref] = useUpdateNotificationPreferencesMutation();

//   const [prefs, setPrefs] = useState({
//     inApp: true,
//     email: true,
//     push: true,
//   });

//   const handleChange = (key) => {
//     setPrefs((p) => ({ ...p, [key]: !p[key] }));
//   };

//   const save = async () => {
//     await updatePref(prefs).unwrap();
//     alert("Preferences saved");
//   };

//   return (
//     <div className="max-w-xl space-y-6">
//       {/* <h2 className="text-xl font-bold">Notification Settings</h2> */}

//       {["inApp", "email", "push"].map((key) => (
//         <label
//           key={key}
//           className="flex justify-between items-center border p-4 rounded"
//         >
//           <span className="capitalize">{key} notifications</span>
//           <input
//             type="checkbox"
//             checked={prefs[key]}
//             onChange={() => handleChange(key)}
//           />
//         </label>
//       ))}

//       <button
//         onClick={save}
//         className="bg-blue-600 text-white px-6 py-2 rounded"
//       >
//         Save Settings
//       </button>
//     </div>
//   );
// }


"use client";

import {
  useGetNotificationPreferencesQuery,
  useUpdateNotificationPreferencesMutation,
} from "@/features/users/userApi";
import { useEffect, useState } from "react";

export default function NotificationSettings() {
  const { data, isLoading } = useGetNotificationPreferencesQuery();
  const [updatePref, { isLoading: saving }] =
    useUpdateNotificationPreferencesMutation();

  const [prefs, setPrefs] = useState(null);

  /* ---------------- LOAD FROM API ---------------- */
  useEffect(() => {
    if (data) {
      setPrefs(data);
    }
  }, [data]);

  const toggle = (key) => {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
  };

  const save = async () => {
    try {
      await updatePref(prefs).unwrap();
      alert("Preferences saved");
    } catch {
      alert("Failed to save preferences");
    }
  };

  if (isLoading || !prefs) {
    return <p className="text-sm text-gray-500">Loading preferences...</p>;
  }

  return (
    <div className="max-w-xl space-y-6">
      <h2 className="text-xl font-semibold">Notification Settings</h2>

      {[
        { key: "inApp", label: "In-app notifications" },
        { key: "email", label: "Email notifications" },
        { key: "push", label: "Push notifications" },
      ].map(({ key, label }) => (
        <label
          key={key}
          className="flex justify-between items-center border p-4 rounded-lg"
        >
          <span>{label}</span>
          <input
            type="checkbox"
            checked={prefs[key]}
            onChange={() => toggle(key)}
          />
        </label>
      ))}

      <button
        onClick={save}
        disabled={saving}
        className="bg-indigo-600 text-white px-6 py-2 rounded disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Settings"}
      </button>
    </div>
  );
}
