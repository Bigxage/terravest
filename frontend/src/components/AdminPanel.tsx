"use client";

import { useState } from "react";
import { useAdmin } from "@/hooks/useAdmin";

export default function AdminPanel() {
  const { initializePlatform, createProperty } = useAdmin();

  const [treasury, setTreasury] = useState("");
  const [propertyId, setPropertyId] = useState("1");
  const [name, setName] = useState("Luxury Apartment");
  const [location, setLocation] = useState("Lagos, Nigeria");
  const [pricePerUnitLamports, setPricePerUnitLamports] = useState("10000000");
  const [totalUnits, setTotalUnits] = useState("100");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const onInitialize = async () => {
    try {
      console.log("Initialize clicked");
      setLoading(true);
      setStatus("Initializing platform...");

      const tx = await initializePlatform(treasury);

      console.log("Initialize success:", tx);
      setStatus(`Platform initialized: ${tx}`);
    } catch (error: any) {
      console.error("Initialize failed:", error);

      setStatus(
        error?.message ||
          error?.error?.message ||
          error?.toString?.() ||
          "Initialize failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const onCreateProperty = async () => {
    try {
      console.log("Create property clicked");
      setLoading(true);
      setStatus("Creating property...");

      const tx = await createProperty({
        propertyId: Number(propertyId),
        name,
        location,
        pricePerUnitLamports: Number(pricePerUnitLamports),
        totalUnits: Number(totalUnits),
      });

      console.log("Create property success:", tx);
      setStatus(`Property created: ${tx}`);
    } catch (error: any) {
      console.error("Create property failed:", error);

      setStatus(
        error?.message ||
          error?.error?.message ||
          error?.toString?.() ||
          "Create property failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-2xl border border-gray-800 bg-secondary p-6">
      <h2 className="mb-4 text-2xl font-semibold">Admin Panel</h2>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Initialize Platform</h3>
          <input
            className="w-full rounded-lg border border-gray-700 bg-black/30 p-3 outline-none"
            placeholder="Treasury wallet address"
            value={treasury}
            onChange={(e) => setTreasury(e.target.value)}
          />
          <button
            onClick={onInitialize}
            disabled={loading}
            className="rounded-lg bg-accent px-5 py-3 font-semibold text-black disabled:opacity-50"
          >
            {loading ? "Processing..." : "Initialize Platform"}
          </button>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-medium">Create Property</h3>

          <input
            className="w-full rounded-lg border border-gray-700 bg-black/30 p-3 outline-none"
            placeholder="Property ID"
            value={propertyId}
            onChange={(e) => setPropertyId(e.target.value)}
          />

          <input
            className="w-full rounded-lg border border-gray-700 bg-black/30 p-3 outline-none"
            placeholder="Property name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="w-full rounded-lg border border-gray-700 bg-black/30 p-3 outline-none"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <input
            className="w-full rounded-lg border border-gray-700 bg-black/30 p-3 outline-none"
            placeholder="Price per unit in lamports"
            value={pricePerUnitLamports}
            onChange={(e) => setPricePerUnitLamports(e.target.value)}
          />

          <input
            className="w-full rounded-lg border border-gray-700 bg-black/30 p-3 outline-none"
            placeholder="Total units"
            value={totalUnits}
            onChange={(e) => setTotalUnits(e.target.value)}
          />

          <button
            onClick={onCreateProperty}
            disabled={loading}
            className="rounded-lg bg-accent px-5 py-3 font-semibold text-black disabled:opacity-50"
          >
            {loading ? "Processing..." : "Create Property"}
          </button>
        </div>
      </div>

      {status && (
        <div className="mt-5 rounded-lg border border-gray-700 bg-black/20 p-3 text-sm">
          {status}
        </div>
      )}
    </section>
  );
}