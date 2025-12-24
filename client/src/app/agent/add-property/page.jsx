"use client";

import AgentGuard from "@/components/AgentGuard";
import { useCreatePropertyMutation } from "@/features/properties/propertyApi";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddPropertyPage() {
  const router = useRouter();
  const [images, setImages] = useState([]);

  const [createProperty, { isLoading }] = useCreatePropertyMutation();

  const [form, setForm] = useState({
    title: "",
    description: "",
    purpose: "sale",
    type: "flat",
    price: "",
    area: "",
    bedrooms: "",
    bathrooms: "",
    amenities: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("purpose", form.purpose);
    formData.append("type", form.type);
    formData.append("price", form.price);
    formData.append("area", form.area);
    formData.append("bedrooms", form.bedrooms);
    formData.append("bathrooms", form.bathrooms);
    formData.append("amenities", form.amenities);

    formData.append(
      "location",
      JSON.stringify({
        city: form.city,
        state: form.state,
        pincode: form.pincode,
      })
    );

    images.forEach((img) => {
      formData.append("images", img);
    });

    await createProperty(formData).unwrap();
    router.push("/agent/properties");
  };

  return (
    <AgentGuard>
      <main className="min-h-screen max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Add Property</h1>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <input
            name="title"
            placeholder="Title"
            required
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <textarea
            name="description"
            placeholder="Description"
            required
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <div className="grid grid-cols-2 gap-4">
            <select
              name="purpose"
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value="sale">Sale</option>
              <option value="rent">Rent</option>
            </select>

            <select
              name="type"
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value="flat">Flat</option>
              <option value="villa">Villa</option>
              <option value="plot">Plot</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              name="price"
              type="number"
              placeholder="Price"
              required
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              name="area"
              type="number"
              placeholder="Area (sqft)"
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              name="bedrooms"
              type="number"
              placeholder="Bedrooms"
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              name="bathrooms"
              type="number"
              placeholder="Bathrooms"
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </div>

          <input
            name="amenities"
            placeholder="Amenities (comma separated)"
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setImages([...e.target.files])}
            className="border p-2 rounded"
          />

          <div className="grid grid-cols-3 gap-4">
            <input
              name="city"
              placeholder="City"
              required
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              name="state"
              placeholder="State"
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              name="pincode"
              placeholder="Pincode"
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </div>

          <button
            disabled={isLoading}
            className="bg-blue-600 text-white py-2 rounded"
          >
            {isLoading ? "Saving..." : "Add Property"}
          </button>
        </form>
      </main>
    </AgentGuard>
  );
}
