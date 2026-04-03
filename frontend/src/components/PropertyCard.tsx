"use client";

import { useInvest } from "@/hooks/useInvest";

interface PropertyCardProps {
  title: string;
  location: string;
  price: number;
  roi: string;
}

export default function PropertyCard({
  title,
  location,
  price,
  roi,
}: PropertyCardProps) {
  const { invest } = useInvest();

  return (
    <div className="bg-secondary p-5 rounded-xl">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-gray-400">{location}</p>

      <p className="mt-2 text-lg font-bold">
        {price} SOL per unit
      </p>

      <p className="text-sm text-green-400">
        ROI: {roi}
      </p>

      <button
        onClick={() => invest(1, 1)}
        className="mt-4 bg-accent px-4 py-2 rounded"
      >
        Invest Now
      </button>
    </div>
  );
}