import { sendEmail } from "../utils/sendEmail.js";
import { approvalEmail } from "../utils/emailTemplate.js";
import { rejectionEmail } from "../utils/emailTemplate.js";
import { undoRejectEmail } from "../utils/emailTemplate.js";
import Property from "../models/Property.js";
import Notification from "../models/Notification.js";
import { sendPush } from "../utils/push.js";
import ApprovalLog from "../models/ApprovalLog.js";

export const approveProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate("agent");

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    property.isApproved = true;
    property.rejectionReason = null;

    await ApprovalLog.create({
      property: property._id,
      admin: req.user._id,
      action: "approved",
    });

    await property.save();

    await Notification.create({
      user: property.agent._id,
      title: "Property Approved",
      message: `${property.title} has been approved`,
      type: "approve",
      property: property._id,
      link: `/properties/${property._id}`,
    });

    sendPush({
      token: property.agent?.pushToken,
      title: "Property Approved",
      body: `${property.title} has been approved`,
    }).catch(() => {});

    sendEmail({
      to: property.agent?.email,
      subject: "Property Approved ✅",
      html: approvalEmail(property),
      type: "approve",
      propertyId: property._id,
      userId: property.agent?._id,
    }).catch(() => {});

    res.json({ message: "Property approved" });
  } catch (err) {
    console.error("❌ approveProperty failed:", err);
    res.status(500).json({ message: "Failed to approve property" });
  }
};

export const rejectProperty = async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ message: "Rejection reason required" });
    }

    const property = await Property.findById(req.params.id).populate("agent");

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    property.isApproved = false;
    property.rejectionReason = reason;
    await property.save();
    await ApprovalLog.create({
      property: property._id,
      admin: req.user._id,
      action: "rejected",
      reason,
    });

    await Notification.create({
      user: property.agent._id,
      title: "Property Rejected",
      message: `${property.title} was rejected`,
      type: "reject",
      property: property._id,
      link: `/agent/properties/${property._id}`,
    });

    sendPush({
      token: property.agent?.pushToken,
      title: "Property Rejected",
      body: property.title,
    }).catch(() => {});

    sendEmail({
      to: property.agent?.email,
      subject: "Property Rejected ❌",
      html: rejectionEmail(property, reason),
      type: "reject",
      propertyId: property._id,
      userId: property.agent?._id,
    }).catch(() => {});

    res.json({ message: "Property rejected" });
  } catch (error) {
    console.error("❌ rejectProperty failed:", error);
    res.status(500).json({ message: "Failed to reject property" });
  }
};

export const undoRejectProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate("agent");

    if (!property || !property.rejectionReason) {
      return res.status(400).json({ message: "Property is not rejected" });
    }

    property.rejectionReason = null;
    await property.save();
    await ApprovalLog.create({
      property: property._id,
      admin: req.user._id,
      action: "undo_reject",
    });
    await Notification.create({
      user: property.agent._id,
      title: "Property Under Review",
      message: `${property.title} is back under review`,
      type: "undo",
      property: property._id,
      link: `/agent/properties/${property._id}`,
    });

    sendPush({
      token: property.agent?.pushToken,
      title: "Property Under Review",
      body: `${property.title} is back under review`,
    }).catch(() => {});

    sendEmail({
      to: property.agent?.email,
      subject: "Property Review Reopened 🔁",
      html: undoRejectEmail(property),
      type: "undo",
      propertyId: property._id,
      userId: property.agent?._id,
    }).catch(() => {});

    res.json({ message: "Rejection undone" });
  } catch (err) {
    console.error("❌ undoRejectProperty failed:", err);
    res.status(500).json({ message: "Failed to undo rejection" });
  }
};
