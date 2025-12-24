import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Property from "../models/Property.js";
import User from "../models/User.js";

dotenv.config();

const properties = [
  // ================= HYDERABAD =================
  {
    title: "Luxury 3BHK Apartment",
    description: "Premium apartment near IT corridor",
    purpose: "sale",
    type: "flat",
    price: 8500000,
    area: 1800,
    bedrooms: 3,
    bathrooms: 3,
    amenities: ["Lift", "Gym", "Parking"],
    images: ["https://images.unsplash.com/photo-1568605114967-8130f3a36994"],
    location: {
      address: "Gachibowli",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500032",
    },
    isApproved: true,
  },
  {
    title: "Gated Community Villa",
    description: "Spacious villa in gated community",
    purpose: "sale",
    type: "villa",
    price: 18500000,
    area: 3200,
    bedrooms: 4,
    bathrooms: 4,
    amenities: ["Garden", "Security", "Parking"],
    images: ["https://images.unsplash.com/photo-1605276373954-0c4a0dac5b12"],
    location: {
      address: "Kokapet",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500075",
    },
    isApproved: true,
  },
  {
    title: "Studio Apartment",
    description: "Compact studio for working professionals",
    purpose: "rent",
    type: "flat",
    price: 18000,
    area: 600,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ["Lift", "Power Backup"],
    images: ["https://images.unsplash.com/photo-1523217582562-09d0def993a6"],
    location: {
      address: "Madhapur",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500081",
    },
    isApproved: true,
  },

  // ================= BANGALORE =================
  {
    title: "Modern Villa with Garden",
    description: "Independent villa in gated layout",
    purpose: "sale",
    type: "villa",
    price: 21000000,
    area: 3400,
    bedrooms: 4,
    bathrooms: 4,
    amenities: ["Garden", "Security"],
    images: ["https://images.unsplash.com/photo-1572120360610-d971b9b78825"],
    location: {
      address: "Whitefield",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560066",
    },
    isApproved: true,
  },
  {
    title: "Affordable 2BHK Apartment",
    description: "Budget friendly apartment",
    purpose: "sale",
    type: "flat",
    price: 5200000,
    area: 1150,
    bedrooms: 2,
    bathrooms: 2,
    amenities: ["Lift", "Parking"],
    images: ["https://images.unsplash.com/photo-1599423300746-b62533397364"],
    location: {
      address: "Yelahanka",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560064",
    },
    isApproved: true,
  },
  {
    title: "3BHK Family Apartment",
    description: "Spacious apartment near schools",
    purpose: "rent",
    type: "flat",
    price: 35000,
    area: 1600,
    bedrooms: 3,
    bathrooms: 3,
    amenities: ["Lift", "Power Backup"],
    images: ["https://images.unsplash.com/photo-1580587771525-78b9dba3b914"],
    location: {
      address: "Sarjapur Road",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560035",
    },
    isApproved: true,
  },

  // ================= CHENNAI =================
  {
    title: "2BHK Flat Near Metro",
    description: "Well connected residential flat",
    purpose: "rent",
    type: "flat",
    price: 28000,
    area: 1100,
    bedrooms: 2,
    bathrooms: 2,
    amenities: ["Lift", "Parking"],
    images: ["https://images.unsplash.com/photo-1598928506311-c55ded91a20c"],
    location: {
      address: "Velachery",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600042",
    },
    isApproved: true,
  },
  {
    title: "Independent House",
    description: "Spacious independent house",
    purpose: "sale",
    type: "villa",
    price: 15000000,
    area: 2800,
    bedrooms: 4,
    bathrooms: 4,
    amenities: ["Parking", "Terrace"],
    images: ["https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde"],
    location: {
      address: "Anna Nagar",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600040",
    },
    isApproved: true,
  },
  {
    title: "Beachside Luxury Villa",
    description: "Premium villa near ECR beach",
    purpose: "sale",
    type: "villa",
    price: 45000000,
    area: 4200,
    bedrooms: 5,
    bathrooms: 5,
    amenities: ["Sea View", "Private Pool"],
    images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9"],
    location: {
      address: "ECR",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600115",
    },
    isApproved: true,
  },
];

// 🔁 Duplicate data to reach ~25 properties
const expandedProperties = Array(3)
  .fill(properties)
  .flat()
  .slice(0, 25);

const importData = async () => {
  try {
    await connectDB();

    const agent = await User.findOne({ role: "agent" });
    if (!agent) {
      console.log("❌ Create an agent user first");
      process.exit(1);
    }

    await Property.deleteMany();

    const finalData = expandedProperties.map((p, index) => ({
      ...p,
      title: `${p.title} #${index + 1}`,
      agent: agent._id,
    }));

    await Property.insertMany(finalData);

    console.log(`✅ ${finalData.length} properties seeded successfully`);
    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

importData();
