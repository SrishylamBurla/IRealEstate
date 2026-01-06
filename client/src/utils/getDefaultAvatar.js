export function getDefaultAvatar(role) {
  switch (role) {
    case "admin":
      return "/avatars/admin.png";
    case "agent":
      return "/avatars/agent.png";
    default:
      return "/avatars/user.png";
  }
}
