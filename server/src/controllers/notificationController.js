import Notification from "../models/Notification.js";

export const getMyNotifications = async (req, res) => {
  const notifications = await Notification.find({
    user: req.user._id,
  })
    .sort({ createdAt: -1 })
    .limit(20);

  res.json(notifications);
};

export const markAsRead = async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, {
    isRead: true,
  });

  res.json({ message: "Marked as read" });
};

export const markAllRead = async (req, res) => {
  await Notification.updateMany(
    { user: req.user._id, isRead: false },
    { isRead: true }
  );
  res.json({ message: "All notifications marked as read" });
};

export const clearAllNotifications = async (req, res) => {
  await Notification.deleteMany({ user: req.user._id });
  res.json({ message: "All notifications cleared" });
};