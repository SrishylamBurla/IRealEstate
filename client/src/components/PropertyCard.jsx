import Link from "next/link";

export default function PropertyCard({ property }) {
  return (
    <Link href={`/properties/${property.id}`}>
      <div className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition bg-white cursor-pointer">
        {/* Image */}
        <div className="h-48 w-full bg-gray-200">
          <img
            src={property.image}
            alt={property.title}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-1">
            {property.title}
          </h2>

          <p className="text-sm text-gray-500 mb-2">
            {property.location}
          </p>

          <p className="text-blue-600 font-bold">
            {property.price}
          </p>
        </div>
      </div>
    </Link>
  );
}
