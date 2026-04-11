"use client";

import { useState } from "react";
import { useInvest } from "@/hooks/useInvest";

interface PropertyCardProps {
  propertyId: number;
  title: string;
  location: string;
  price: number;
  roi: string;
}

const DEMO_TREASURY = process.env.NEXT_PUBLIC_DEMO_TREASURY || "";

export default function PropertyCard({
  propertyId,
  title,
  location,
  price,
  roi,
}: PropertyCardProps) {
  const { invest } = useInvest();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const onInvest = async () => {
    try {
      setLoading(true);
      setStatus("Submitting investment...");

      const sig = await invest(propertyId, 1, DEMO_TREASURY);

      setStatus(
        `Investment successful: ${sig}\nExplorer: https://explorer.solana.com/tx/${sig}?cluster=devnet`
      );
    } catch (error: any) {
      console.error("Invest failed:", error);
      setStatus(
        error?.message ||
          error?.error?.message ||
          error?.toString?.() ||
          "Investment failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-700 bg-[#1A2233] p-5 text-white shadow-lg">
      <div className="mb-4 h-52 rounded-lg bg-gradient-to-br from-gray-700 to-gray-900" />

      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="text-gray-300">{location}</p>
      <p className="mt-2 text-lg font-bold text-white">{price} SOL per unit</p>
      <p className="text-sm text-emerald-400">ROI: {roi}</p>

      <button
        onClick={onInvest}
        disabled={loading}
        className="mt-4 inline-block rounded-lg bg-emerald-400 px-4 py-3 font-semibold text-black disabled:opacity-50"
      >
        {loading ? "Processing..." : "Invest Now"}
      </button>

      {status && (
        <div className="mt-4 whitespace-pre-wrap break-all rounded-lg border border-gray-700 bg-black/20 p-3 text-sm text-white">
          {status}
        </div>
      )}
    </div>
  );
}