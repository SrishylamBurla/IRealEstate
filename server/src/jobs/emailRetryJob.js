import cron from "node-cron";
import EmailLog from "../models/EmailLog.js";
import Property from "../models/Property.js";
import { sendEmail } from "../utils/sendEmail.js";
import {
  approvalEmail,
  rejectionEmail,
  undoRejectEmail,
} from "../utils/emailTemplate.js";

const MAX_RETRIES = 3;

cron.schedule("*/5 * * * *", async () => {
  console.log("⏳ Running email retry job...");

  const failedEmails = await EmailLog.find({
    status: "failed",
    retryCount: { $lt: MAX_RETRIES },
  }).limit(5); // prevent overload

  for (const log of failedEmails) {
    try {
      const property = await Property.findById(log.property).populate("agent");

      if (!property || !property.agent?.email) continue;

      let html;
      if (log.type === "approve") html = approvalEmail(property);
      if (log.type === "reject")
        html = rejectionEmail(property, property.rejectionReason);
      if (log.type === "undo") html = undoRejectEmail(property);

      await sendEmail({
        to: property.agent.email,
        subject: log.subject,
        html,
        type: log.type,
        propertyId: property._id,
        userId: property.agent._id,
        retryOf: log,
      });

    } catch (err) {
      console.error("Retry job error:", err.message);
    }
  }
});
