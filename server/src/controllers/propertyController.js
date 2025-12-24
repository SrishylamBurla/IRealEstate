import Property from "../models/Property.js";
import cloudinary from "../config/cloudinary.js";
import ApprovalLog from "../models/ApprovalLog.js";
// import { sendEmail } from "../utils/sendEmail.js"

export const createProperty = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Form data missing" });
    }

    const property = await Property.create({
      title: req.body.title,
      description: req.body.description,
      purpose: req.body.purpose,
      type: req.body.type,
      price: Number(req.body.price),
      area: Number(req.body.area),
      bedrooms: Number(req.body.bedrooms),
      bathrooms: Number(req.body.bathrooms),
      amenities: req.body.amenities ? req.body.amenities.split(",") : [],
      images: req.files.map((file) => file.path),
      location: JSON.parse(req.body.location),
      agent: req.user._id,
      isApproved: req.user.role === "admin",
    });

    res.status(201).json(property);
  } catch (error) {
    console.error("CREATE PROPERTY ERROR:", error);
    res.status(500).json({ message: "Failed to create property" });
  }
};

export const getProperties = async (req, res) => {
  const {
    city,
    purpose,
    type,
    minPrice,
    maxPrice,
    bedrooms,
    page = 1,
    limit = 30,
  } = req.query;

  const query = { isApproved: true, isDeleted: false };

  if (city) query["location.city"] = city;
  if (purpose) query.purpose = purpose;
  if (type) query.type = type;
  if (bedrooms) query.bedrooms = bedrooms;

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  const properties = await Property.find(query)
    .populate("agent", "name phone")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Property.countDocuments(query);
// console.log("Properties from API:", properties);

  res.json({
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    properties,
  });
};

export const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({
      agent: req.user._id,
      isDeleted: false
    })
      .sort({ createdAt: -1 })
      .populate("agent", "name email phone");

    res.status(200).json(properties);
  } catch (error) {
    console.error("GET MY PROPERTIES ERROR:", error);
    res.status(500).json({ message: "Failed to fetch agent properties" });
  }
};

export const getPropertyById = async (req, res) => {
  const property = await Property.findById(req.params.id).populate(
    "agent",
    "name phone"
  );

  if (!property) {
    return res.status(404).json({ message: "Property not found" });
  }

  property.views += 1;
  await property.save();

  res.json(property);
};

export const updateProperty = async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    return res.status(404).json({ message: "Property not found" });
  }

  // Only owner or admin
  if (
    property.agent.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  Object.assign(property, req.body);
  const updated = await property.save();

  res.json(updated);
};

// export const deleteProperty = async (req, res) => {
//   const property = await Property.findById(req.params.id);

//   if (!property) {
//     return res.status(404).json({ message: "Property not found" });
//   }

//   if (
//     property.agent.toString() !== req.user._id.toString() &&
//     req.user.role !== "admin"
//   ) {
//     return res.status(403).json({ message: "Unauthorized" });
//   }

//   await property.deleteOne();
//   res.json({ message: "Property removed" });
// };


export const updatePropertyImages = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Ownership check
    if (
      property.agent.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Images to remove (array of URLs)
    const removeImages = req.body.removeImages
      ? JSON.parse(req.body.removeImages)
      : [];

    // 🔥 DELETE FROM CLOUDINARY
    for (const img of removeImages) {
      const publicId = img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`properties/${publicId}`);
    }

    // Remove from DB
    property.images = property.images.filter(
      (img) => !removeImages.includes(img)
    );

    // Add new uploaded images
    if (req.files?.length) {
      const newImages = req.files.map((file) => file.path);
      property.images.push(...newImages);
    }

    await property.save();

    res.json(property);
  } catch (error) {
    console.error("UPDATE PROPERTY IMAGES ERROR:", error);
    res.status(500).json({ message: "Failed to update images" });
  }
};

export const getPendingProperties = async (req, res) => {
  try {
    const properties = await Property.find({ isApproved: false })
      .populate("agent", "name email phone")
      .sort({ createdAt: -1 });

    res.json(properties);
  } catch (error) {
    console.error("GET PENDING PROPERTIES ERROR:", error);
    res.status(500).json({ message: "Failed to fetch pending properties" });
  }
};

export const resubmitProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Ownership check
    if (
      property.agent.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Only rejected properties can be resubmitted
    if (!property.rejectionReason) {
      return res.status(400).json({
        message: "Property is not rejected",
      });
    }

    // Update fields
    Object.assign(property, req.body);

    await ApprovalLog.create({
      property: property._id,
      admin: req.user._id, // agent id still stored
      action: "resubmitted",
    });

    // Reset rejection state
    property.rejectionReason = null;
    property.rejectedAt = null;
    property.isApproved = false;

    await property.save();

    res.json({
      message: "Property resubmitted for approval",
      property,
    });
  } catch (error) {
    console.error("RESUBMIT PROPERTY ERROR:", error);
    res.status(500).json({
      message: "Failed to resubmit property",
    });
  }
};


export const getPropertyApprovalHistory = async (req, res) => {
  try {
    const logs = await ApprovalLog.find({
      property: req.params.id,
    })
      .populate("admin", "name email role")
      .sort({ createdAt: -1 });

    res.json(logs);
  } catch (error) {
    console.error("GET APPROVAL HISTORY ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch approval history",
    });
  }
};


export const softDeleteProperty = async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) return res.status(404).json({ message: "Not found" });

  if (
    property.agent.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  property.isDeleted = true;
  property.deletedAt = new Date();
  await property.save();

//   sendEmail({
//   to: property.agent.email,
//   subject: "Property Deleted",
//   html: `
//     <p>Your property <b>${property.title}</b> was moved to trash.</p>
//     <p>You can restore it within 30 days.</p>
//   `,
//   type: "delete",
//   propertyId: property._id,
//   userId: property.agent._id,
// });


  res.json({ message: "Property moved to trash" });
};


export const permanentDeleteProperty = async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) return res.status(404).json({ message: "Not found" });

  await property.deleteOne();
//   sendEmail({
//   subject: "Property Permanently Deleted",
//   html: "Your property was permanently removed by admin",
// });

  res.json({ message: "Property permanently deleted" });
};



export const restoreProperty = async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property || !property.isDeleted) {
    return res.status(400).json({ message: "Property not in trash" });
  }

  if (
    property.agent.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  property.isDeleted = false;
  property.deletedAt = null;
  await property.save();

  res.json({ message: "Property restored" });
};


// GET deleted properties (Agent Trash)
export const getMyDeletedProperties = async (req, res) => {
  const properties = await Property.find({
    agent: req.user._id,
    isDeleted: true,
  }).sort({ deletedAt: -1 });

  res.json(properties);
};

export const getAllDeletedProperties = async (req, res) => {
  try {
    const properties = await Property.find({ isDeleted: true })
      .populate("agent", "name email phone")
      .sort({ deletedAt: -1 });

    res.json(properties);
  } catch (error) {
    console.error("GET ADMIN TRASH ERROR:", error);
    res.status(500).json({ message: "Failed to fetch deleted properties" });
  }
};
