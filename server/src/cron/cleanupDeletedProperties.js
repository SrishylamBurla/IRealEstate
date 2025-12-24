import cron from "node-cron";
import Property from "../models/Property.js";
import cloudinary from "../config/cloudinary.js";

export const startCleanupJob = () => {
  // Runs every day at 2:00 AM
  cron.schedule("0 2 * * *", async () => {
    console.log("🧹 Running trash cleanup job...");

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 30);

    const properties = await Property.find({
      isDeleted: true,
      deletedAt: { $lte: cutoffDate },
    });

    for (const property of properties) {
      // 🔥 Remove images from Cloudinary
      for (const img of property.images) {
        const publicId = img.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`properties/${publicId}`);
      }

      await property.deleteOne();
      console.log(`❌ Permanently deleted: ${property.title}`);
    }

    console.log(`✅ Cleanup complete: ${properties.length} items removed`);
  });
};
