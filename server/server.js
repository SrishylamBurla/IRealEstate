import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";

import connectDB from "./src/config/db.js";

import "./src/config/cloudinary.js";
import "./src/jobs/emailRetryJob.js";

import authRoutes from "./src/routes/authRoutes.js";
import propertyRoutes from "./src/routes/propertyRoutes.js";
import inquiryRoutes from "./src/routes/inquiryRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import notificationRoutes from "./src/routes/notificationRoutes.js"
import userRoutes from "./src/routes/userRoutes.js"
import { sendPush } from "./src/utils/push.js";

// import { sendEmail } from "./src/utils/sendEmail.js";

import { initSocket } from "./socket.js";
import http from "http";
import { startCleanupJob } from "./src/cron/cleanupDeletedProperties.js";

connectDB();

const app = express();
const server = http.createServer(app);

initSocket(server);

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

startCleanupJob()

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/users", userRoutes);


app.get("/test-push", async (req, res) => {
  const token = "PASTE_AGENT_PUSH_TOKEN_HERE";

  await sendPush({
    token,
    title: "🔥 Test Push",
    body: "Push notification is working",
  });

  res.send("Push sent");
});
// app.get("/test-email", async (req, res) => {
//   await sendEmail({
//     to: "srishylamburla2@gmail.com",
//     subject: "iRealEstate Test Email",
//     html: "<h1>Email system works</h1>",
//   });

//   res.send("Test email triggered");
// });

app.get("/", (req, res) => {
  res.send("Real Estate API is running 🚀");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
