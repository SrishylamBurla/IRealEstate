
export const notify = ({ title, body }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user?.notificationEnabled) return;

  if (Notification.permission === "granted") {
    new Notification(title, { body });
  }
};
