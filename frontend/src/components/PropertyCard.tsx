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

export default function PropertyCard({
  propertyId,
  title,
  location,
  price,
  roi,
}: PropertyCardProps) {
  const { invest } = useInvest();
  const [loading, setLoading] = useState(false);

  const onInvest = async () => {
    try {
      setLoading(true);
      await invest(propertyId, 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-800 bg-secondary p-5 shadow-lg transition duration-300 hover:scale-[1.03]">
      <div className="mb-4 h-52 rounded-lg bg-gradient-to-br from-gray-700 to-gray-900" />

      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-gray-400">{location}</p>

      <p className="mt-2 text-lg font-bold">{price} SOL per unit</p>
      <p className="text-sm text-green-400">ROI: {roi}</p>

      <button
        onClick={onInvest}
        disabled={loading}
        className="mt-4 rounded bg-accent px-4 py-2 font-semibold text-black disabled:opacity-50"
      >
        {loading ? "Processing..." : "Invest Now"}
      </button>
    </div>
  );
}