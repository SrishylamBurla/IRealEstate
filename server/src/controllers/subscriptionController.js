import User from "../models/User.js";

export const subscribeAgent = async (req, res) => {
  const { plan } = req.body;

  if (!plan) {
    return res.status(400).json({ message: "Plan is required" });
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.role === "agent") {
    return res.status(400).json({ message: "Already an agent" });
  }

  user.role = "agent";
  user.subscription = {
    plan,
    startedAt: new Date(),
    expiresAt:
      plan === "monthly"
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  };

  await user.save();

  res.status(200).json({
    message: "Subscribed successfully",
    subscription: user.subscription,
  });
};
