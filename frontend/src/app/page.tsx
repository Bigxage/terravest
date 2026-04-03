"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PropertyCard from "@/components/PropertyCard";
import AdminPanel from "@/components/AdminPanel";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />

      <section className="px-10 pb-12">
        <AdminPanel />
      </section>

      <section className="px-10 pb-20">
        <h2 className="mb-8 text-3xl font-semibold">Featured Properties</h2>

        <div className="grid gap-8 md:grid-cols-3">
          <PropertyCard
            title="Luxury Apartment"
            location="Lagos, Nigeria"
            price={0.01}
            roi="12%"
          />
          <PropertyCard
            title="Beachfront Villa"
            location="Lekki, Lagos"
            price={0.05}
            roi="15%"
          />
          <PropertyCard
            title="Urban Housing"
            location="Abuja"
            price={0.02}
            roi="10%"
          />
        </div>
      </section>
    </main>
  );
}