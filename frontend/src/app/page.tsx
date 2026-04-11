"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PropertyCard from "@/components/PropertyCard";
import AdminPanel from "@/components/AdminPanel";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0B0F1A] text-white">
      <Navbar />
      <Hero />

      <section className="px-10 pb-12">
        <AdminPanel />
      </section>

      <section className="px-10 pb-20">
        <h2 className="mb-8 text-3xl font-semibold text-white">
          Featured Property
        </h2>

        <div className="max-w-md">
          <PropertyCard
            propertyId={1}
            title="Luxury Apartment"
            location="Lagos, Nigeria"
            price={0.01}
            roi="12%"
          />
        </div>
      </section>
    </main>
  );
}