"use client";

import AgentGuard from "@/components/AgentGuard";
import {
  useGetPropertyByIdQuery,
  useUpdatePropertyMutation,
  useUpdatePropertyImagesMutation,
  useResubmitPropertyMutation,
} from "@/features/properties/propertyApi";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function EditPropertyPage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isResubmit = searchParams.get("resubmit") === "true";
  const { data: property, isLoading } = useGetPropertyByIdQuery(id);
  const [resubmitProperty] = useResubmitPropertyMutation();

  const [updateProperty, { isLoading: isUpdating }] =
    useUpdatePropertyMutation();

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
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  /* 🔁 PREFILL FORM */
  useEffect(() => {
    if (!property) return;

    setForm({
      title: property.title || "",
      description: property.description || "",
      purpose: property.purpose || "sale",
      type: property.type || "flat",
      price: property.price || "",
      area: property.area || "",
      bedrooms: property.bedrooms || "",
      bathrooms: property.bathrooms || "",
      amenities: property.amenities?.join(", ") || "",
      address: property.location?.address || "",
      city: property.location?.city || "",
      state: property.location?.state || "",
      pincode: property.location?.pincode || "",
    });
  }, [property]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: form.title,
      description: form.description,
      purpose: form.purpose,
      type: form.type,
      price: Number(form.price),
      area: Number(form.area),
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      amenities: form.amenities
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
      location: {
        address: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
      },
    };

    if (isResubmit) {
      await resubmitProperty({ id, data: payload }).unwrap();
    } else {
      await updateProperty({ id, data: payload }).unwrap();
    }
    router.push("/agent/properties");
  };

  if (isLoading) {
    return <p className="p-6">Loading property...</p>;
  }

  return (
    <AgentGuard>
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Edit Property</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* TITLE */}
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full border p-2 rounded"
            required
          />

          {/* DESCRIPTION */}
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            rows={4}
            className="w-full border p-2 rounded"
            required
          />

          {/* PURPOSE + TYPE */}
          <div className="grid grid-cols-2 gap-4">
            <select
              name="purpose"
              value={form.purpose}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value="sale">Sale</option>
              <option value="rent">Rent</option>
            </select>

            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value="flat">Flat</option>
              <option value="villa">Villa</option>
              <option value="plot">Plot</option>
            </select>
          </div>

          {/* PRICE + AREA */}
          <div className="grid grid-cols-2 gap-4">
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="Price"
              className="border p-2 rounded"
              required
            />

            <input
              name="area"
              type="number"
              value={form.area}
              onChange={handleChange}
              placeholder="Area (sqft)"
              className="border p-2 rounded"
            />
          </div>

          {/* BED / BATH */}
          <div className="grid grid-cols-2 gap-4">
            <input
              name="bedrooms"
              type="number"
              value={form.bedrooms}
              onChange={handleChange}
              placeholder="Bedrooms"
              className="border p-2 rounded"
            />

            <input
              name="bathrooms"
              type="number"
              value={form.bathrooms}
              onChange={handleChange}
              placeholder="Bathrooms"
              className="border p-2 rounded"
            />
          </div>

          {/* AMENITIES */}
          <input
            name="amenities"
            value={form.amenities}
            onChange={handleChange}
            placeholder="Amenities (comma separated)"
            className="border p-2 rounded"
          />

          {/* LOCATION */}
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Address"
            className="border p-2 rounded"
          />

          <div className="grid grid-cols-3 gap-4">
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="City"
              className="border p-2 rounded"
            />

            <input
              name="state"
              value={form.state}
              onChange={handleChange}
              placeholder="State"
              className="border p-2 rounded"
            />

            <input
              name="pincode"
              value={form.pincode}
              onChange={handleChange}
              placeholder="Pincode"
              className="border p-2 rounded"
            />
          </div>

          {/* ACTIONS */}
          <div className="flex gap-4 pt-4">
            {/* <button
              disabled={isUpdating}
              className="bg-blue-600 text-white px-6 py-2 rounded"
            >
              {isUpdating ? "Updating..." : "Update Property"}
            </button> */}
            <button className="bg-blue-600 text-white px-6 py-2 rounded">
              {isResubmit ? "Resubmit for Approval" : "Update Property"}
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              className="border px-6 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
        <ImageManager propertyId={id} images={property.images || []} />
      </main>
    </AgentGuard>
  );
}

/* ---------------- IMAGE MANAGER ---------------- */

function ImageManager({ propertyId, images }) {
  const [selected, setSelected] = useState([]);
  const [files, setFiles] = useState([]);

  const [updateImages, { isLoading }] = useUpdatePropertyImagesMutation();

  const toggleImage = (img) => {
    setSelected((prev) =>
      prev.includes(img) ? prev.filter((i) => i !== img) : [...prev, img]
    );
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("removeImages", JSON.stringify(selected));

    for (const file of files) {
      formData.append("images", file);
    }

    await updateImages({ id: propertyId, formData }).unwrap();
    setSelected([]);
    setFiles([]);
  };

  return (
    <div className="mt-10 border-t pt-6">
      <h2 className="text-xl font-semibold mb-4">Manage Images</h2>

      {/* EXISTING IMAGES */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {images.map((img) => (
          <div
            key={img}
            onClick={() => toggleImage(img)}
            className={`cursor-pointer border rounded overflow-hidden ${
              selected.includes(img) ? "ring-2 ring-red-500" : ""
            }`}
          >
            <img src={img} className="h-32 w-full object-cover" />
          </div>
        ))}
      </div>

      <p className="text-sm text-gray-500 mb-4">
        Click images to mark for removal
      </p>

      {/* ADD NEW IMAGES */}
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => setFiles([...e.target.files])}
        className="mb-4"
      />

      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="bg-red-600 text-white px-6 py-2 rounded"
      >
        {isLoading ? "Updating..." : "Update Images"}
      </button>
    </div>
  );
}
