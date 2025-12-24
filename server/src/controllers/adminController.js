import User from "../models/User.js";
import Property from "../models/Property.js";
import Inquiry from "../models/Inquiry.js";

// 👥 USERS
export const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

// 🏠 PROPERTIES
export const getAllProperties = async (req, res) => {
  const properties = await Property.find()
    .populate("agent", "name email");
  res.json(properties);
};

// 📩 INQUIRIES
export const getAllInquiries = async (req, res) => {
  const inquiries = await Inquiry.find()
    .populate("user", "name email")
    .populate("property", "title");
  res.json(inquiries);
};

