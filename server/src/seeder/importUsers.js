import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const users = [
  // ================= AGENTS =================
  {
    name: "Ramesh Kumar",
    email: "agent1@test.com",
    phone: "9000000001",
    password: "123456",
    role: "agent",
  },
  {
    name: "Suresh Reddy",
    email: "agent2@test.com",
    phone: "9000000002",
    password: "123456",
    role: "agent",
  },
  {
    name: "Anita Sharma",
    email: "agent3@test.com",
    phone: "9000000003",
    password: "123456",
    role: "agent",
  },

  // ================= USERS =================
  {
    name: "Rahul Verma",
    email: "user1@test.com",
    phone: "9100000001",
    password: "123456",
    role: "user",
  },
  {
    name: "Priya Singh",
    email: "user2@test.com",
    phone: "9100000002",
    password: "123456",
    role: "user",
  },
  {
    name: "Amit Patel",
    email: "user3@test.com",
    phone: "9100000003",
    password: "123456",
    role: "user",
  },
  {
    name: "Sneha Iyer",
    email: "user4@test.com",
    phone: "9100000004",
    password: "123456",
    role: "user",
  },
  {
    name: "Arjun Mehta",
    email: "user5@test.com",
    phone: "9100000005",
    password: "123456",
    role: "user",
  },
];

const importUsers = async () => {
  try {
    await connectDB();

    // ⚠️ Clear existing users (optional but recommended for dev)
    await User.deleteMany();

    // Insert users (password will be hashed by schema)
    // await User.insertMany(users);

     // ✅ save() triggers pre-save hook
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
    }

    console.log("✅ Users seeded successfully");
    process.exit();
  } catch (error) {
    console.error("❌ User seeding failed:", error);
    process.exit(1);
  }
};

importUsers();
