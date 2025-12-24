
"use client";

import { useState } from "react";
import PropertyCard from "../../components/PropertyCard";
import { useGetPropertiesQuery } from "@/features/properties/propertyApi";

export default function PropertiesPage() {
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const { data, isLoading, isError } = useGetPropertiesQuery({
    city,
    type,
    maxPrice,
  });

  return (
    <main className="min-h-screen max-w-6xl mx-auto p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Available Properties</h1>

      {/* FILTERS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="border rounded p-2"
        >
          <option value="">All Cities</option>
          <option value="Hyderabad">Hyderabad</option>
          <option value="Bangalore">Bangalore</option>
          <option value="Chennai">Chennai</option>
        </select>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border rounded p-2"
        >
          <option value="">All Types</option>
          <option value="flat">Flat</option>
          <option value="villa">Villa</option>
        </select>

        <select
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border rounded p-2"
        >
          <option value="">Any Price</option>
          <option value="5000000">Up to ₹50L</option>
          <option value="10000000">Up to ₹1Cr</option>
          <option value="20000000">Up to ₹2Cr</option>
        </select>
      </div>

      {/* STATES */}
      {isLoading && <p>Loading properties...</p>}
      {isError && <p className="text-red-500">Failed to load properties</p>}

      {/* GRID */}
      {data?.properties?.length === 0 ? (
        <p>No properties found.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {data?.properties?.map((property) => (
            <PropertyCard
              key={property._id}
              property={{
                id: property._id,
                title: property.title,
                location: property.location?.city,
                price: `₹${property.price.toLocaleString()}`,
                image: property.images?.[0],
              }}
            />
          ))}
        </div>
      )}
    </main>
  );
}


