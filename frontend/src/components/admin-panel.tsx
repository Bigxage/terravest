"use client";

import { useMemo, useState } from "react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useCreateProperty } from "@/hooks/useCreateProperty";

const DEMO_SOL_USD_RATE = 150;

const presetProperties = [
  {
    id: 11,
    name: "Imperial Villa – Karsana",
    location: "Karsana, Abuja",
    pricePerUnitUsd: 2,
    totalUnits: 10000,
  },
  {
    id: 12,
    name: "Harmonies Homes – Kuje",
    location: "Kuje, Abuja",
    pricePerUnitUsd: 1,
    totalUnits: 8000,
  },
  {
    id: 13,
    name: "Nova Garden – Kurudu",
    location: "Kurudu, Abuja",
    pricePerUnitUsd: 1,
    totalUnits: 12000,
  },
  {
    id: 14,
    name: "Abundance City – Apo Tafyi",
    location: "Apo Tafyi, Abuja",
    pricePerUnitUsd: 2,
    totalUnits: 9000,
  },
  {
    id: 15,
    name: "Skyline Exclusive – Gousa",
    location: "Gousa, Abuja",
    pricePerUnitUsd: 2,
    totalUnits: 7000,
  },
];

function usdToSol(usd: number) {
  return usd / DEMO_SOL_USD_RATE;
}

function usdToLamports(usd: number) {
  return Math.round(usdToSol(usd) * LAMPORTS_PER_SOL);
}

export default function AdminPanel() {
  const { createProperty } = useCreateProperty();

  const [selectedId, setSelectedId] = useState<number>(11);
  const [name, setName] = useState("Imperial Villa – Karsana");
  const [location, setLocation] = useState("Karsana, Abuja");
  const [pricePerUnitUsd, setPricePerUnitUsd] = useState<number>(2);
  const [totalUnits, setTotalUnits] = useState<number>(10000);
  const [loadingProperty, setLoadingProperty] = useState(false);
  const [status, setStatus] = useState("");

  const selectedProperty = useMemo(
    () => presetProperties.find((item) => item.id === selectedId),
    [selectedId]
  );

  const handlePresetChange = (id: number) => {
    setSelectedId(id);

    const preset = presetProperties.find((item) => item.id === id);
    if (!preset) return;

    setName(preset.name);
    setLocation(preset.location);
    setPricePerUnitUsd(preset.pricePerUnitUsd);
    setTotalUnits(preset.totalUnits);
  };

  const onCreateProperty = async () => {
    try {
      setLoadingProperty(true);
      setStatus("Creating property onchain...");

      const pricePerUnitLamports = usdToLamports(pricePerUnitUsd);

      const signature = await createProperty({
        propertyId: selectedId,
        name,
        location,
        pricePerUnitLamports,
        totalUnits,
      });

      setStatus(
        `Property created successfully.\nTransaction: ${signature}\nExplorer: https://explorer.solana.com/tx/${signature}?cluster=devnet`
      );
    } catch (error: unknown) {
      console.error("Create property failed:", error);

      const message =
        error instanceof Error
          ? error.message
          : typeof error === "string"
          ? error
          : "Failed to create property";

      setStatus(message);
    } finally {
      setLoadingProperty(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-white/10 bg-[#121926] p-5">
        <h2 className="text-xl font-semibold text-white">Create Property</h2>
        <p className="mt-2 text-white/70">
          Create a new onchain property record using USD as the pricing anchor
          and devnet SOL as the payment rail.
        </p>

        <div className="mt-3 rounded-xl border border-blue-400/20 bg-blue-400/10 p-4 text-sm text-blue-100">
          Demo conversion rate: <span className="font-semibold">1 SOL = ${DEMO_SOL_USD_RATE}</span>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-white/80">
              Select Preset
            </label>
            <select
              value={selectedId}
              onChange={(e) => handlePresetChange(Number(e.target.value))}
              className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
            >
              {presetProperties.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.id} — {property.name}
                </option>
              ))}
            </select>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Property ID
                </label>
                <input
                  type="number"
                  min={1}
                  value={selectedId}
                  onChange={(e) => setSelectedId(Number(e.target.value))}
                  className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Property Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Price Per Unit (USD)
                </label>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={pricePerUnitUsd}
                  onChange={(e) => setPricePerUnitUsd(Number(e.target.value))}
                  className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Total Units
                </label>
                <input
                  type="number"
                  min={1}
                  value={totalUnits}
                  onChange={(e) => setTotalUnits(Number(e.target.value))}
                  className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
                />
              </div>
            </div>

            <button
              onClick={onCreateProperty}
              disabled={loadingProperty}
              className="mt-6 inline-flex rounded-lg bg-emerald-400 px-5 py-3 font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loadingProperty ? "Creating..." : "Create Property"}
            </button>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">Selected Property</h3>

            {selectedProperty ? (
              <div className="mt-4 space-y-3 text-white/80">
                <p>
                  <span className="font-semibold text-white">Property ID:</span>{" "}
                  {selectedId}
                </p>
                <p>
                  <span className="font-semibold text-white">Name:</span> {name}
                </p>
                <p>
                  <span className="font-semibold text-white">Location:</span>{" "}
                  {location}
                </p>
                <p>
                  <span className="font-semibold text-white">Price Per Unit:</span>{" "}
                  ${pricePerUnitUsd}
                </p>
                <p>
                  <span className="font-semibold text-white">SOL Equivalent:</span>{" "}
                  {usdToSol(pricePerUnitUsd).toFixed(6)} SOL
                </p>
                <p>
                  <span className="font-semibold text-white">Total Units:</span>{" "}
                  {totalUnits.toLocaleString()}
                </p>
                <p>
                  <span className="font-semibold text-white">
                    Onchain Price (lamports):
                  </span>{" "}
                  {usdToLamports(pricePerUnitUsd).toLocaleString()}
                </p>
              </div>
            ) : (
              <p className="mt-4 text-white/60">Custom property setup.</p>
            )}

            <div className="mt-6 rounded-xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-100">
              Property values stay anchored in USD. The app converts them to SOL
              for devnet payment at the current demo rate.
            </div>
          </div>
        </div>
      </div>

      {status && (
        <div className="whitespace-pre-wrap break-words rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-white">
          {status}
        </div>
      )}
    </div>
  );
}