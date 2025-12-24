// "use client";

// export default function NotificationStatus() {
//   const permission =
//     typeof window !== "undefined"
//       ? localStorage.getItem("notifyPermission")
//       : null;

//   if (!permission) return null;

//   if (permission === "granted") {
//     return (
//       <p className="text-sm text-green-600 mb-4">
//         🔔 Notifications are enabled
//       </p>
//     );
//   }

//   if (permission === "denied") {
//     return (
//       <p className="text-sm text-red-600 mb-4">
//         🔕 Notifications are blocked in browser
//       </p>
//     );
//   }

//   return null;
// }


"use client";

export default function NotificationStatus({ enabled }) {
  if (enabled) {
    return (
      <div className="text-sm text-green-600 flex items-center gap-1 pb-2">
        🔔 Notifications enabled
      </div>
    );
  }

  return (
    <div className="text-sm text-gray-500 flex items-center gap-1 pb-2">
      🔕 Notifications disabled
    </div>
  );
}
