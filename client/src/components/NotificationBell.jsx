"use client";

import { useState, useRef, useEffect } from "react";

import { Bell } from "lucide-react";
import {
  useGetMyNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllReadMutation,
  useClearAllNotificationsMutation,
} from "@/features/notifications/notificationApi";
import Link from "next/link";

/* ---------------- HELPERS ---------------- */

function isSameDay(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function isYesterday(date) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameDay(date, yesterday);
}

function groupNotifications(notifications) {
  const groups = {
    Today: [],
    Yesterday: [],
    Earlier: [],
  };

  const now = new Date();

  notifications.forEach((n) => {
    const created = new Date(n.createdAt);

    if (isSameDay(created, now)) {
      groups.Today.push(n);
    } else if (isYesterday(created)) {
      groups.Yesterday.push(n);
    } else {
      groups.Earlier.push(n);
    }
  });

  return groups;
}

/* ---------------- COMPONENT ---------------- */

export default function NotificationBell() {
  const { data: notifications = [] } = useGetMyNotificationsQuery();
  const [markRead] = useMarkNotificationReadMutation();
  const [clearAll] = useClearAllNotificationsMutation();
  const [markAllRead] = useMarkAllReadMutation();
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const grouped = groupNotifications(notifications);
  const containerRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      {/* 🔔 Bell */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex items-center justify-center"
      >
        <Bell size={20} color="white" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500" />
        )}
      </button>

      {/* 📩 Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-80 rounded-lg bg-white shadow-xl z-50">
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-2 bg-amber-100 border-b">
            <span className="font-semibold">Notifications</span>
            {unreadCount > 0 && (
              <span className="text-xs text-gray-600">
                {unreadCount} unread
              </span>
            )}

            <div className="flex gap-3 text-xs">
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllRead()}
                  className="text-blue-600 hover:underline"
                >
                  Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={() => clearAll()}
                  className="text-red-600 hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="max-h-[420px] overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-sm text-gray-500 text-center">
                No notifications
              </p>
            ) : (
              Object.entries(grouped).map(([group, items]) =>
                items.length > 0 ? (
                  <div key={group}>
                    {/* Group title */}
                    <p className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50 sticky top-0">
                      {group}
                    </p>

                    {items.map((n) => (
                      <div
                        key={n._id}
                        onClick={() => markRead(n._id)}
                        className={`flex gap-3 px-4 py-3 text-sm cursor-pointer border-b hover:bg-gray-50 ${
                          !n.isRead ? "bg-blue-50" : ""
                        }`}
                      >
                        {/* Dot */}
                        <span
                          className={`mt-1 h-2 w-2 rounded-full ${
                            !n.isRead ? "bg-red-600" : "bg-gray-400"
                          }`}
                        />

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
                    ))}
                  </div>
                ) : null
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
