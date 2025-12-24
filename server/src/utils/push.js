import webpush from "web-push";

webpush.setVapidDetails(
  "mailto:support@irealestate.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export const sendPush = async (subscription, payload) => {
  try {
    // 🚫 HARD GUARD (THIS FIXES YOUR ERROR)
    if (
      !subscription ||
      !subscription.endpoint ||
      !subscription.keys
    ) {
      console.warn("🔕 Push skipped: invalid subscription");
      return;
    }

    await webpush.sendNotification(
      subscription,
      JSON.stringify(payload)
    );
  } catch (error) {
    console.error("🔕 Push failed (non-blocking):", error.message);
  }
};
