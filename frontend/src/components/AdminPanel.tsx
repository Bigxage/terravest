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
  const [initialized, setInitialized] = useState(false);

  const onInitialize = async () => {
    try {
      console.log("Initialize clicked");
      setLoading(true);
      setStatus("Initializing platform...");

      const tx = await initializePlatform(treasury);

      console.log("Initialize success:", tx);
      setInitialized(true);
      setStatus(
        `Platform initialized: ${tx}\nExplorer: https://explorer.solana.com/tx/${tx}?cluster=devnet`
      );
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
      setStatus(
        `Property created: ${tx}\nExplorer: https://explorer.solana.com/tx/${tx}?cluster=devnet`
      );

      setPropertyId("");
      setName("");
      setLocation("");
      setPricePerUnitLamports("");
      setTotalUnits("");
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
    <section className="rounded-2xl border border-gray-700 bg-[#1A2233] p-6 text-white">
      <h2 className="mb-6 text-2xl font-semibold text-white">Admin Panel</h2>

      <div className="flex flex-col gap-8">
        <div className="space-y-3 rounded-xl border border-gray-700 bg-black/20 p-4">
          <h3 className="text-lg font-medium text-white">
            Initialize Platform (Step 1)
          </h3>

          <input
            className="w-full rounded-lg border border-gray-600 bg-[#0B0F1A] p-3 text-white outline-none placeholder:text-gray-400"
            placeholder="Treasury wallet address"
            value={treasury}
            onChange={(e) => setTreasury(e.target.value)}
          />

          <button
            onClick={onInitialize}
            disabled={loading || initialized}
            className="rounded-lg bg-emerald-400 px-5 py-3 font-semibold text-black disabled:opacity-50"
          >
            {initialized
              ? "Already Initialized"
              : loading
              ? "Processing..."
              : "Initialize Platform"}
          </button>
        </div>

        <div className="space-y-3 rounded-xl border border-gray-700 bg-black/20 p-4">
          <h3 className="text-lg font-medium text-white">
            Create Property (Step 2)
          </h3>

          <input
            className="w-full rounded-lg border border-gray-600 bg-[#0B0F1A] p-3 text-white outline-none placeholder:text-gray-400"
            placeholder="Property ID"
            value={propertyId}
            onChange={(e) => setPropertyId(e.target.value)}
          />

          <input
            className="w-full rounded-lg border border-gray-600 bg-[#0B0F1A] p-3 text-white outline-none placeholder:text-gray-400"
            placeholder="Property name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="w-full rounded-lg border border-gray-600 bg-[#0B0F1A] p-3 text-white outline-none placeholder:text-gray-400"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <input
            className="w-full rounded-lg border border-gray-600 bg-[#0B0F1A] p-3 text-white outline-none placeholder:text-gray-400"
            placeholder="Price per unit in lamports"
            value={pricePerUnitLamports}
            onChange={(e) => setPricePerUnitLamports(e.target.value)}
          />

          <input
            className="w-full rounded-lg border border-gray-600 bg-[#0B0F1A] p-3 text-white outline-none placeholder:text-gray-400"
            placeholder="Total units"
            value={totalUnits}
            onChange={(e) => setTotalUnits(e.target.value)}
          />

          <button
            onClick={onCreateProperty}
            disabled={loading}
            className="rounded-lg bg-emerald-400 px-5 py-3 font-semibold text-black disabled:opacity-50"
          >
            {loading ? "Processing..." : "Create Property"}
          </button>
        </div>
      </div>

      {status && (
        <div className="mt-5 whitespace-pre-wrap break-all rounded-lg border border-gray-700 bg-black/20 p-3 text-sm text-white">
          {status}
        </div>
      )}
    </section>
  );
}