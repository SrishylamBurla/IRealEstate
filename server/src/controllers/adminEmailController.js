import EmailLog from "../models/EmailLog.js";
import { approvalEmail, rejectionEmail, undoRejectEmail } from "../utils/emailTemplate.js";
import Property from "../models/Property.js";
import { sendEmail } from "../utils/sendEmail.js";

export const getEmailLogs = async (req, res) => {
  const logs = await EmailLog.find()
    .populate("property", "title")
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  res.json(logs);
};

export const resendEmail = async (req, res) => {
  const log = await EmailLog.findById(req.params.id);

  if (!log) {
    return res.status(404).json({ message: "Email log not found" });
  }

  const property = await Property.findById(log.property).populate("agent");

  if (!property || !property.agent?.email) {
    return res.status(400).json({ message: "Invalid agent or property" });
  }

  let html;

  switch (log.type) {
    case "approve":
      html = approvalEmail(property);
      break;

    case "reject":
      html = rejectionEmail(property, property.rejectionReason);
      break;

    case "undo":
      html = undoRejectEmail(property);
      break;

    default:
      return res.status(400).json({ message: "Unsupported email type" });
  }

  await sendEmail({
    to: property.agent.email,
    subject: log.subject,
    html,
    type: log.type,
    propertyId: property._id,
    userId: property.agent._id,
  });

  res.json({ message: "Email resent" });
};