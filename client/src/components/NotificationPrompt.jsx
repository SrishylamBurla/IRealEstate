"use client";

import { useEffect, useState } from "react";
import { getFirebaseMessaging, getToken } from "@/firebase";
import { useUpdateNotificationPreferenceMutation } from "@/features/users/userApi";

export default function NotificationPrompt({ onEnabled }) {
  const [show, setShow] = useState(false);
  const [updatePref] = useUpdateNotificationPreferenceMutation();
  useEffect(() => {
    const dismissed = localStorage.getItem("notifyPromptDismissed");
    if (!dismissed && "Notification" in window) {
      setShow(true);
    }
  }, []);

  const handleEnable = async () => {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return;
    localStorage.setItem("notifyPermission", permission);
    localStorage.setItem("notifyPromptDismissed", "true");

    const messaging = getFirebaseMessaging();
    if (!messaging) return;

    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });

    // console.log("🟢 Permission:", permission);
    // console.log("🔥 FCM Token:", token);

    await updatePref({
      pushSubscription: subscriptionObject,
    });

    onEnabled?.();
    setShow(false);
    // alert("🔔 Push notifications enabled!");
  };

  const handleDismiss = () => {
    localStorage.setItem("notifyPromptDismissed", "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="mb-6 border border-blue-200 bg-blue-50 p-4 rounded-lg flex items-center justify-between">
      <div>
        <p className="font-medium">🔔 Enable notifications</p>
        <p className="text-sm text-gray-600">
          Get instant alerts when your property is approved or rejected.
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleEnable}
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm cursor-pointer"
        >
          Enable
        </button>

        <button
          onClick={handleDismiss}
          className="text-sm text-gray-600 cursor-pointer"
        >
          Not now
        </button>
      </div>
    </div>
  );
}
