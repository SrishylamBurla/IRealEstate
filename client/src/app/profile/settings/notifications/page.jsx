"use client";

import AgentGuard from "@/components/AgentGuard";
import NotificationSettings from "@/components/NotificationSettings";

export default function AgentNotificationSettingsPage() {
  return (
    <AgentGuard>
      <main className="max-w-4xl mx-auto p-6">
        {/* <h1 className="text-2xl font-bold mb-6">
          Notification Settings
        </h1> */}

        <NotificationSettings />
      </main>
    </AgentGuard>
  );
}
