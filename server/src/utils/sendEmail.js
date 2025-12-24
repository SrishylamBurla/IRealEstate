import nodemailer from "nodemailer";
import EmailLog from "../models/EmailLog.js";

/* ---------------- TRANSPORTER (CREATE ONCE) ---------------- */

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

/* ---------------- SEND EMAIL ---------------- */

export const sendEmail = async ({
  to,
  subject,
  html,
  type,
  propertyId,
  userId,
  retryOf = null,
}) => {
  let logPayload = {
    to,
    subject,
    type,
    property: propertyId,
    user: userId,
    retryCount: retryOf?.retryCount
      ? retryOf.retryCount + 1
      : 0,
    lastTriedAt: new Date(),
  };

  try {
    await transporter.sendMail({
      from: `"iRealEstate" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    await EmailLog.create({
      ...logPayload,
      status: "success",
    });

    return { success: true };
  } catch (error) {
    console.error("📧 Email failed:", error.message);

    await EmailLog.create({
      ...logPayload,
      status: "failed",
      error: error.message,
    });

    return {
      success: false,
      error: error.message,
    };
  }
};
