import dotenv from "dotenv";
dotenv.config(); // 🔥 FORCE LOAD HERE

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// // DEBUG (keep until verified)
// console.log("☁️ CLOUDINARY CLOUD:", process.env.CLOUDINARY_CLOUD_NAME);
// console.log("☁️ CLOUDINARY KEY:", process.env.CLOUDINARY_API_KEY ? "SET" : "MISSING");
// console.log("☁️ CLOUDINARY SECRET:", process.env.CLOUDINARY_API_SECRET ? "SET" : "MISSING");

export default cloudinary;

