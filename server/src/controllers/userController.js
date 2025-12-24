export const updateNotificationPreference = async (req, res) => {
  const { permission, token } = req.body;

  console.log("🔔 Saving notification preference:", permission);
  console.log("📌 Saving push token:", token);

  req.user.notificationPermission = permission;
  req.user.notificationEnabled = permission === "granted";

  if (token) {
    req.user.pushToken = token;
  }

  await req.user.save();

  res.json({ message: "Notification settings updated" });
};
