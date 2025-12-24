import Inquiry from "../models/Inquiry.js";
import Property from "../models/Property.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";

export const createInquiry = async (req, res) => {
  try {
    const { propertyId, name, phone, message } = req.body;

    // 1️⃣ Always create inquiry first
    const inquiry = await Inquiry.create({
      property: propertyId,
      user: req.user._id,
      name,
      phone,
      message,
    });

    // 2️⃣ Send response immediately (IMPORTANT)
    res.status(201).json(inquiry);

    // 3️⃣ Send emails in background (NON-BLOCKING)
    try {
      const property = await Property.findById(propertyId).populate(
        "agent",
        "email name"
      );
      const user = await User.findById(req.user._id);

      // Agent email
      await sendEmail({
        to: property.agent.email,
        subject: "New Property Inquiry",
        html: `
          <h3>New Inquiry</h3>
          <p><b>Property:</b> ${property.title}</p>
          <p><b>Name:</b> ${name}</p>
          <p><b>Phone:</b> ${phone}</p>
          <p><b>Message:</b> ${message}</p>
        `,
      });

      // User email
      await sendEmail({
        to: user.email,
        subject: "We received your inquiry",
        html: `
          <p>Hi ${user.name},</p>
          <p>Your inquiry for <b>${property.title}</b> has been received.</p>
          <p>Our agent will contact you soon.</p>
        `,
      });
    } catch (emailError) {
      console.error("EMAIL FAILED (non-blocking):", emailError.message);
    }
  } catch (error) {
    console.error("CREATE INQUIRY ERROR:", error);
    res.status(500).json({ message: "Failed to create inquiry" });
  }
};

// export const createInquiry = async (req, res) => {
//   const { propertyId, name, phone, message } = req.body;

//   const property = await Property.findById(propertyId).populate("agent");

//   if (!property || !property.isApproved) {
//     return res.status(404).json({ message: "Property not available" });
//   }

//   const inquiry = await Inquiry.create({
//     property: propertyId,
//     user: req.user?._id || null,
//     name,
//     phone,
//     message,
//   });

//   res.status(201).json({
//     message: "Inquiry sent successfully",
//     inquiry,
//   });
// };

export const getMyInquiries = async (req, res) => {
  const inquiries = await Inquiry.find()
    .populate({
      path: "property",
      match: { agent: req.user._id },
      populate: { path: "agent", select: "name phone" },
    })
    .sort({ createdAt: -1 });

  // remove null properties
  const filtered = inquiries.filter((i) => i.property);

  res.json(filtered);
};

// 👤 USER: View own inquiries
export const getMyRequests = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({
      user: req.user._id,
    })
      .populate("property", "title location")
      .sort({ createdAt: -1 });

    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: "Failed to load inquiries" });
  }
};

export const updateInquiryStatus = async (req, res) => {
  try {
    // console.log("UPDATE STATUS BODY:", req.body);
    // console.log("UPDATE STATUS PARAM:", req.params.id);

    const { status } = req.body;

    const inquiry = await Inquiry.findById(req.params.id);

    // console.log("FOUND INQUIRY:", inquiry);

    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    inquiry.status = status;
    await inquiry.save();

    res.json(inquiry);
  } catch (error) {
    console.error("UPDATE STATUS ERROR:", error);
    res.status(500).json({ message: "Failed to update status" });
  }
};


// export const updateInquiryStatus = async (req, res) => {
//   try {
//     const { status } = req.body;

//     if (!["new", "contacted", "closed"].includes(status)) {
//       return res.status(400).json({ message: "Invalid status" });
//     }

//     const inquiry = await Inquiry.findById(req.params.id);

//     if (!inquiry) {
//       return res.status(404).json({ message: "Inquiry not found" });
//     }

//     inquiry.status = status;
//     await inquiry.save();

//     res.json(inquiry);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to update status" });
//   }
// };


export const getAllInquiries = async (req, res) => {
  const inquiries = await Inquiry.find()
    .populate("property", "title")
    .populate("user", "name email phone")
    .sort({ createdAt: -1 });

  res.json(inquiries);
};
