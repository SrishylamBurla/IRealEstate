"use client";

import { Bell } from "lucide-react";
import {
  useGetMyNotificationsQuery,
  useMarkNotificationReadMutation,
} from "@/features/notifications/notificationApi";
import { useState } from "react";
import Link from "next/link";

export default function NotificationBell() {
  const { data: notifications = [] } = useGetMyNotificationsQuery();
  const [markRead] = useMarkNotificationReadMutation();
  const [open, setOpen] = useState(false);

  const unread = notifications.filter((n) => !n.isRead);

  return (
    <div className="relative">
      {/* 🔔 Bell */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex items-center justify-center"
      >
        <Bell size={20} />
        {unread.length > 0 && (
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500" />
        )}
      </button>

      {/* 📩 Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-80 rounded-lg bg-white shadow-xl shadow-lg z-50">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-amber-100 px-4 py-2 font-semibold border-b">
            Notifications
          </div>

          {/* List */}
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-sm text-gray-500 text-center">
                No notifications
              </p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => markRead(n._id)}
                  className={`flex gap-3 px-4 py-3 text-sm cursor-pointer border-b last:border-b-0 hover:bg-gray-50 ${
                    !n.isRead ? "bg-blue-50" : ""
                  }`}
                >
                  {/* Dot */}
                  <div className="flex justify-center items-center">
                    <span
                      className={`h-2 w-2 rounded-full block ${
                        !n.isRead ? "bg-red-600" : "bg-gray-400"
                      }`}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <p className="font-medium">{n.title}</p>
                    <p className="text-gray-600 text-xs mt-1">
                      {n.message}
                    </p>

                    {n.link && (
                      <Link
                        href={n.link}
                        className="inline-block mt-1 text-xs text-blue-600 hover:underline"
                      >
                        View details →
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
