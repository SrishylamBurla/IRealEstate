"use client";

import { useState } from "react";
import { useCreateInquiryMutation } from "../features/inquiries/inquiryApi";

export default function InquiryForm({ propertyId }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    message: "",
  });

  const [createInquiry, { isLoading, isSuccess, isError }] =
    useCreateInquiryMutation();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createInquiry({
      propertyId,
      ...form,
    });

    setForm({ name: "", phone: "", message: "" });
  };

  return (
    <div className="shadow-[0px_4px_6px_0px_rgba(147,_51,_234,_0.5)] rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">
        Contact Agent
      </h2>

      {isSuccess && (
        <p className="text-green-600 mb-3">
          Inquiry sent successfully!
        </p>
      )}

      {isError && (
        <p className="text-red-600 mb-3">
          Failed to send inquiry
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border rounded p-2"
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          required
          className="w-full border rounded p-2"
        />

        <textarea
          name="message"
          placeholder="Message"
          value={form.message}
          onChange={handleChange}
          rows="4"
          className="w-full border rounded p-2"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gray-800 text-white py-2 rounded hover:bg-black transition"
        >
          {isLoading ? "Sending..." : "Send Inquiry"}
        </button>
      </form>
    </div>
  );
}
