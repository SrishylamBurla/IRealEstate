"use client";

import { useParams } from "next/navigation";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetPropertyByIdQuery } from "@/features/properties/propertyApi";
import InquiryForm from "@/components/InquiryForm";

export default function PropertyDetailsPage() {
  const { id } = useParams();

  const { data: property, isLoading, isError } =
    useGetPropertyByIdQuery(id ?? skipToken);

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Loading property...</p>
      </main>
    );
  }

  if (isError || !property) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Property not found</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen max-w-5xl mx-auto p-6">
      <div className="w-full h-[400px] mb-6 rounded-lg overflow-hidden bg-gray-200">
        <img
          src={property.images?.[0]}
          alt={property.title}
          className="w-full h-full object-cover"
        />
      </div>

      <h1 className="text-3xl font-bold mb-2">{property.title}</h1>

      <p className="text-gray-600 mb-4">
        {property.location?.city}
      </p>

      <p className="text-2xl font-semibold text-blue-600 mb-6">
        ₹{property.price}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <Info label="Bedrooms" value={property.bedrooms} />
        <Info label="Bathrooms" value={property.bathrooms} />
        <Info label="Area" value={`${property.area} sqft`} />
      </div>

      <div className="shadow-[0px_4px_6px_0px_rgba(59,_130,_246,_0.5)] rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">Description</h2>
        <p className="text-gray-700">{property.description}</p>
      </div>

      
        <InquiryForm propertyId={property._id} />
      
      

    </main>
  );
}

function Info({ label, value }) {
  return (
    <div className="shadow-[0px_4px_6px_0px_rgba(59,_130,_246,_0.5)] rounded p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}
