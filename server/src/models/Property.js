import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    purpose: {
      type: String,
      enum: ["sale", "rent"],
      required: true,
    },

    type: {
      type: String,
      enum: ["flat", "villa", "plot"],
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    area: {
      type: Number, // sqft
    },

    bedrooms: Number,
    bathrooms: Number,

    amenities: [String],

    images: [String],

    location: {
      address: String,
      city: {
        type: String,
        index: true,
      },
      state: String,
      pincode: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },

    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isApproved: {
      type: Boolean,
      default: false,
      index: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },
    rejectionReason: {
      type: String,
      default: null,
    },

    rejectedAt: {
      type: Date,
      default: null,
    },
    views: {
      type: Number,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true
    },
    deletedAt: {
      type: Date,
      default: null
    },
    approvalHistory: [
      {
        action: {
          type: String,
          enum: ["approved", "rejected", "undo_reject", "resubmitted"],
          required: true,
        },
        reason: String,
        by: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

// 🔍 INDEXES (VERY IMPORTANT)
// propertySchema.index({ price: 1 });
// propertySchema.index({ purpose: 1, type: 1 });
// propertySchema.index({ "location.city": 1 });

export default mongoose.model("Property", propertySchema);
