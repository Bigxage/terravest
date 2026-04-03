"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PropertyCard from "@/components/PropertyCard";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />

      <section className="px-10 pb-20">
        <h2 className="text-3xl font-semibold mb-8">
          Featured Properties
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          <PropertyCard
            title="Luxury Apartment"
            location="Lagos, Nigeria"
            price="$500 per share"
            roi="12%"
          />

          <PropertyCard
            title="Beachfront Villa"
            location="Lekki, Lagos"
            price="$1,200 per share"
            roi="15%"
          />

          <PropertyCard
            title="Urban Housing"
            location="Abuja"
            price="$300 per share"
            roi="10%"
          />
        </div>
      </section>
    </main>
  );
}