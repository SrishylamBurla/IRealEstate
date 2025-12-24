import PushSubscription from "../models/PushSubscription.js";

export const saveSubscription = async (req, res) => {
  await PushSubscription.findOneAndUpdate(
    { user: req.user._id },
    { subscription: req.body },
    { upsert: true, new: true }
  );

  res.json({ message: "Push subscription saved" });
};
