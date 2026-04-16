"use client";

import Navbar from "@/components/navbar";
import PropertyCard from "@/components/property-card";
import { useProperties } from "@/hooks/useProperties";

export default function PropertiesPage() {
  const { properties, loading, error } = useProperties();

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Available Properties</h1>
            <p className="mt-2 max-w-2xl text-white/70">
              Browse verified land-backed investment opportunities that have already
              been created onchain from the admin panel.
            </p>
            <p className="mt-2 text-sm text-emerald-300">
              Fetched properties: {properties.length}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/75">
            Loading initialized properties...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-200">
            {error}
          </div>
        ) : properties.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/75">
            No initialized properties are available yet.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                propertyId={property.id}
                title={property.title}
                location={property.location}
                price={property.pricePerUnit}
                roi={property.roi}
                image={property.image}
                totalUnits={property.totalUnits}
                availableUnits={property.availableUnits}
                category={property.category}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}